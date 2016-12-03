# -*- coding: utf-8 -*-
# this file is released under public domain and you can use without limitations

# -------------------------------------------------------------------------
# This is a sample controller
# - index is the default action of any application
# - user is required for authentication and authorization
# - download is for downloading files uploaded in the db (does streaming)
# -------------------------------------------------------------------------
import json
import locale
locale.setlocale( locale.LC_ALL, '' )

#/////////////////////
#INDEX PAGE
#/////////////////////
def index():
    title = "Dropshipping"
    response.flash = T("Welcome to " + title)
    num_items_in_cart = get_number_of_items_in_cart_no_json()
    total = get_number_of_items_in_cart_no_json()

    computers = get_all_products_by_tag_computer()
    televisions = get_all_products_by_tag_television()
    gaming = get_all_products_by_tag_gaming()
    print("\n")
    print(computers)
    print("\n")
    print(televisions)
    print("\n")
    print(gaming)
    print("\n")

    return dict(message=T("Welcome to web2py!" + title),
                total=total,computers=computers,
                televisions=televisions,
                gaming=gaming)

def get_all_products_by_tag_computer():
    query = "select * from product_tag_association where tag_name='Computers'"
    all_products = db.executesql(query, as_dict=True)
    return all_products

def get_all_products_by_tag_television():
    query = "select * from product_tag_association where tag_name='Television'"
    all_products = db.executesql(query, as_dict=True)
    return all_products

def get_all_products_by_tag_gaming():
    query = "select * from product_tag_association where tag_name='Gaming'"
    all_products = db.executesql(query, as_dict=True)
    return all_products

def add_to_cart():
    product_id = str(request.vars.product_id)
    qty = str(request.vars.qty)

    cart_id = get_cart_id()
    product_price = get_price(product_id)

    if order_item_exists_in_cart(product_id):
        query = "select qty from order_item where cart_id = %s and product_id = %s"% (str(cart_id), str(product_id))
        result = db.executesql(query)
        newqty = result[0][0] + int(qty)

        newprice = newqty * product_price

        query = "update order_item set qty = %s, sale_price = '%s' where product_id = %s and cart_id = %s"% (newqty, newprice, product_id, cart_id)
        db.executesql(query)
    else:
        query = "insert into order_item (cart_id, sale_price, product_id, qty) VALUES (" + cart_id + ", " + str(product_price) + ", " + product_id + ", " + qty + ")"
        db.executesql(query)

def get_price(product_id):
    query = "select price from product where product_id = '%s'"% product_id
    price = db.executesql(query)[0][0]
    return price

def get_cart_id():
    if not session.customer_session:
        session.customer_session = response.session_id
    user_id = get_user_id()
    query = "select * from cart where user_id = '" + str(user_id) + "' and status = 'active'"

    result = db.executesql(query)

    if not result:
        cart_id = create_cart()
    else:
        cart_id = str(result[0][0])
    return str(cart_id)


def create_cart():
    user_id = get_user_id()

    query = "insert into cart (user_id) values('" + user_id + "')"
    db.executesql(query)
    db.commit()
    query = "select cart_id from cart where user_id = '" + user_id + "'"
    cart_id = db.executesql(query)

    return str(cart_id[0][0])

def get_number_of_items_in_cart():

    cart_id = get_cart_id()
    query = "select sum(qty) as total from order_item where cart_id = "+ cart_id
    result = db.executesql(query)
    if result[0][0] is not None:
        return json.dumps({'total': int(result[0][0])})
    else:
        return json.dumps(dict(total=0))

def get_number_of_items_in_cart_no_json():
    cart_id = get_cart_id()
    query = "select sum(qty) as total from order_item where cart_id = "+ cart_id
    result = db.executesql(query)

    if result[0][0]:
        return int(result[0][0])
    else:

        return 0


def order_item_exists_in_cart(product_id):
    cart_id = get_cart_id()

    query = "select * from order_item where product_id = '"+str(product_id)+"' and cart_id = '"+str(cart_id)+"'"

    result = db.executesql(query)
    if result:
        response = True
    else:
        response = False
    return response

def remove_from_cart():
    product_id = str(request.vars.product_id)

    cart_id = get_cart_id()

    if order_item_exists_in_cart(product_id):
        query = "delete from order_item where cart_id = " + cart_id + " and product_id = " + product_id
        db.executesql(query)
        #
        response = 1
    else:
        response =0

# ----------Order History-------------------------
def create_purchase_order():

    name = request.vars.full_name
    address1 = request.vars.address1
    address2 = request.vars.address2
    state = request.vars.state
    city = request.vars.city
    zip = request.vars.zip
    email = request.vars.email
    name_on_card = request.vars.name_on_card
    card_number = request.vars.card_number
    exp_month = request.vars.month
    exp_year = request.vars.year
    cvv = request.vars.cvv

    user_data_changed = check_saved_user_data(name, address1, address2, zip, email)

    customer_id = get_customer_id(name, address1, address2, city, state, zip, email)
    sale_price = get_sale_price()
    credit_card_last_4 = card_number[-4:]

    purchase_order_no = insert_po(customer_id, sale_price, credit_card_last_4)
    update_order_items(purchase_order_no)

    return json.dumps(dict(purchase_order_no=purchase_order_no))

def check_saved_user_data(name, address1, address2, zip, email):
    user_data = (name, address1, address2, zip, email)
    user_data_changed = False

    if auth.user_id:
        query = "select full_name, address_1, address_2, zip_code, email from user_info where user_id = %s"% auth.user_id

        result = db.executesql(query)
        if result:
            for i in range(len(user_data)):
                if user_data[i] != result[0][i]:
                    user_data_changed = True
        else:
            user_data_changed = True

    return user_data_changed



def get_customer_id(name, address1, address2, city, state, zip, email):

    query = "insert into po_customer (full_name, address_1, address_2, city, state, zip_code, email) VALUES ('%s', '%s', '%s', '%s', '%s', '%s', '%s')" % (
    name, address1, address2, city, state, zip, email)
    db.executesql(query)
    db.commit()

    query = "select top 1 customer_id from po_customer order by customer_id desc"
    customer_id = db.executesql(query)[0][0]
    return customer_id

def get_sale_price():
    cart_id = get_cart_id()
    query = "select sum(price) from order_item where cart_id = %s"% cart_id
    sale_price = db.executesql(query)[0][0]
    return sale_price


def insert_po(customer_id, sale_price, credit_card_last_4):

    query = "insert into purchase_order (customer_id, sale_price, credit_card_last_4) VALUES ('%s', '%s', '%s')"% (customer_id, sale_price, credit_card_last_4)
    print "INSERT_PO",query
    db.executesql(query)
    db.commit()

    query = "select top 1 purchase_order_no from purchase_order order by purchase_order_no desc"
    purchase_order_no = db.executesql(query)[0][0]
    return purchase_order_no

def update_order_items(purchase_order_no):
    cart_id = get_cart_id()
    query = "update order_item set purchase_order_no = '%s' where cart_id = '%s' and status = 'active'"% (purchase_order_no, cart_id)
    print query
    db.executesql(query)
    db.commit()

def get_user_id():
    user_id = session.customer_session
    return user_id

#/////////////////////
#PRODUCT PAGE
#/////////////////////
def product():
    product_id = request.vars.product_id
    product_details = get_product(product_id)

    total = get_number_of_items_in_cart_no_json()
    reviews = get_reviews(product_id)
    return dict(total=total, product=product_details, reviews=reviews)

def get_product(product_id):

    query = "select * from product_view where product_id = '%s' and [default] = 1"% product_id
    product = db.executesql(query, as_dict=True)[0]
    return product

def get_reviews(product_id):

    query = "select * from review where product_id = '%s'"% product_id
    reviews = db.executesql(query, as_dict=True)

    query = "select AVG(stars) as avg from review where product_id = '%s' group by product_id"% product_id
    average_stars = db.executesql(query, as_dict=True)

    return (reviews, average_stars)

def add_review():
    product_id = request.vars.product_id
    name = request.vars.name
    review = request.vars.review
    stars = request.vars.stars



def order_history():
    po_num = request.vars.purchase_order_no

    query = "select * from purchase_order_view where purchase_order_no = '%s'" % po_num
    data = db.executesql(query, as_dict=True)
    price_list = ("total_price", "sale_price", "subtotal", "tax", "shipping_price")

    fix_price(data, price_list)
    total = get_number_of_items_in_cart_no_json()
    print data
    print "\n"
    return dict(total=total, data=data)
    total = get_number_of_items_in_cart_no_json()
    return dict(location=T('Dropshiping - Checkout'), total=total, data=data)

def get_total_cart_price_json():
    total = 0
    cart_id = get_cart_id()
    query = "select sum(qty*price) as total_price from product_order_item where cart_id = " + cart_id
    result = db.executesql(query, as_dict=True)
    if result[0]['total_price'] is not None:
        total = str(result[0]['total_price'])

    return json.dumps(dict(total_price=total))


def get_total_cart_price():
    cart_id = get_cart_id()
    query = "select sum(qty*price) as total_price from product_order_item where cart_id = " + cart_id
    result = db.executesql(query, as_dict=True)
    if result:
        return str(result[0]['total_price'])
    else:
        return 0

def checkout():
    cart_id = get_cart_id()
    query = "select * from product_order_item where cart_id = " + cart_id
    result = db.executesql(query, as_dict=True)
    total = get_number_of_items_in_cart_no_json()
    total_price = get_total_cart_price()
    return dict(location=T('Dropshiping - Checkout'),items=result,total=total, total_price = total_price)


def contact():
    total = get_number_of_items_in_cart_no_json()
    return dict(total=total)

def contact_post():
    _name = request.vars.name
    _email = request.vars.email
    _message = request.vars.message

    query = "insert into contacts(name, email, message) VALUES('"+ str(_name) +"','"+ str(_email) +"','"+ str(_message) +"')"
    db.executesql(query)

    redirect(URL('index'))

def contact_get():
    return dict()


#/////////////////////
#SEARCH PY FUNCTIONS  ////////////////////////////////////////////////////////////////
#/////////////////////
def search():
    total = get_number_of_items_in_cart_no_json()
    return dict(total=total)

def get_products_view_search(find):
    query=""
    if find:
        query = "select * from product_view where title='"+ find +"'"
    else:
        query = "select * from product_view"

    find_results = db.executesql(query, as_dict=True)

    total = get_number_of_items_in_cart_no_json()
    return dict(total=total,find_results=find_results)

def po_page():
    po_num = request.vars.purchase_order_no

    query = "select * from purchase_order_view where purchase_order_no = '%s'" % po_num
    data = db.executesql(query, as_dict=True)
    price_list = ("total_price", "sale_price", "subtotal", "tax", "shipping_price")

    fix_price(data, price_list)
    total = get_number_of_items_in_cart_no_json()
    print data
    print "\n"
    return dict(total=total, data=data)


def fix_price(results, fields):
    for i in range(len(results)):
        for field_name in fields:
            results[i][field_name] = locale.currency(results[i][field_name], grouping=True)

#/////////////////////
#DEFAULT PY FUNCTIONS  ////////////////////////////////////////////////////////////////
#/////////////////////
@cache.action()
def download():
    """
    allows downloading of uploaded files
    http://..../[app]/default/download/[filename]
    """
    return response.download(request, db)



def call():
    """
    exposes services. for example:
    http://..../[app]/default/call/jsonrpc
    decorate with @services.jsonrpc the functions to expose
    supports xml, json, xmlrpc, jsonrpc, amfrpc, rss, csv
    """
    return service()

def user():
    """
    exposes:
    http://..../[app]/default/user/login
    http://..../[app]/default/user/logout
    http://..../[app]/default/user/register
    http://..../[app]/default/user/profile
    http://..../[app]/default/user/retrieve_password
    http://..../[app]/default/user/change_password
    http://..../[app]/default/user/bulk_register
    use @auth.requires_login()
        @auth.requires_membership('group name')
        @auth.requires_permission('read','table name',record_id)
    to decorate functions that need access control
    also notice there is http://..../[app]/appadmin/manage/auth to allow administrator to manage users
    """
    total = get_number_of_items_in_cart_no_json()
    return dict(form=auth(), total=total)




