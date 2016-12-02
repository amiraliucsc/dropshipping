# -*- coding: utf-8 -*-
# this file is released under public domain and you can use without limitations

# -------------------------------------------------------------------------
# This is a sample controller
# - index is the default action of any application
# - user is required for authentication and authorization
# - download is for downloading files uploaded in the db (does streaming)
# -------------------------------------------------------------------------
import json

#/////////////////////
#INDEX PAGE
#/////////////////////
def index():

    title = "Dropshipping"
    response.flash = T("Welcome to " + title)
    num_items_in_cart = get_number_of_items_in_cart_no_json()
    total = get_number_of_items_in_cart_no_json()
    return dict(message=T("Welcome to web2py!" + title),total=total)

def add_to_cart():
    product_id = str(request.vars.product_id)
    qty = str(request.vars.qty)

    cart_id = get_cart_id()
    
    if order_item_exists_in_cart(product_id):
        query = "select qty from order_item where cart_id = %s and product_id = %s"% (str(cart_id), str(product_id))
        result = db.executesql(query)
        qty = result[0][0] + int(qty)
        query = "update order_item set qty = %s where product_id = %s and cart_id = %s"% (qty, product_id, cart_id)
        db.executesql(query)
    else:
        query = "insert into order_item (cart_id, product_id, qty) VALUES (" + cart_id + ", " + product_id + ", " + qty + ")"
        db.executesql(query)

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
    if result:
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
    
    data = json.loads(request.vars.data)
    

    name = data['full_name']
    
    address1 = data['address1']
    
    address2 = data['address2']
    
    state = data['state']
    
    city = data['city']
    
    zip = data['zip']
    
    email = data['email']
    
    name_on_card = data['name_on_card']
    
    card_number = data['card_number']
    
    exp_month = data['month']
    
    exp_year = data['year']
    
    cvv = data['cvv']
    

    # customer_id = get_customer_id(name, address1, address2, city, state, zip, email)
    # user_data_changed = check_saved_user_data(name, address1, address2, zip, email)
    return dict()




def check_saved_user_data(name, address1, address2, zip, email):
    # user_data = (name, address1, address2, zip, email)
    user_data_changed = False

    # if auth.user_id:
    #     query = "select full_name, address_1, address_2, zip_code, email from user_info where user_id = %s"% auth.user_id
    #     
    #     result = db.executesql(query)
    #     if result:
    #         for i in range(len(user_data)):
    #             if user_data[i] != result[0][i]:
    #                 user_data_changed = True
    #     else:
    #         user_data_changed = True
        
    return user_data_changed



# def get_customer_id(name, address1, address2, city, state, zip, email):
#
#     query = "insert into customer (full_name, address_1, address_2, city, state, zip_code, email) VALUES (%s, %s, %s, %s, %s, %s, %s)" % (
#     name, address1, address2, city, state, zip, email)
#     customer_id = db.executesql(query)
#     query = "select top 1 customer_id from customer order by customer_id desc"
#     
#     return 3


def get_user_id():
    user_id = session.customer_session
    return user_id

#/////////////////////
#PRODUCT PAGE
#/////////////////////
def product():
    total = get_number_of_items_in_cart_no_json()
    return dict(total=total)

def checkout():
    cart_id = get_cart_id()
    
    query = "select * from product_order_item where cart_id = " + cart_id
    result = db.executesql(query, as_dict=True)
    total = get_number_of_items_in_cart_no_json()
    
    return dict(location=T('Dropshiping - Checkout'),items=result,total=total)

#/////////////////////
#CONTACT PAGE
#/////////////////////
def contact():
    total = get_number_of_items_in_cart_no_json()
    return dict(total=total)

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

def po_page():
    total = get_number_of_items_in_cart_no_json()
    return dict(total=total)

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
    return dict(form=auth(),total=total)

"""
def checkout():
    return dict()

#/////////////////////
#PRODUCT PAGE
#/////////////////////
def product():
    return dict()

def get_products_by_location():
    location = request.vars.location
    query = "select * from product_location where product_location = " + location
    data = db.executesql(query, as_dict=True)
    return json.dumps(data)

#/////////////////////
#CONTACT PAGE
#/////////////////////
def contact():
    return dict()

def contact_post():
    return dict()

def contact_get():
    return dict()

#/////////////////////
#CART FUNCTIONS
#/////////////////////
def create_cart():
    user_id = get_user_id()
    query = "insert into cart (user_id) VALUES ('" + str(user_id) + "')"
    res = db.executesql(query)
    response = 1
    return response

def get_cart_id():
    user_id = get_user_id()
    query = "select cart_id from cart where user_id = '" + str(user_id) + "' and status = 'active'"
    result = db.executesql(query,as_dict=True)
    if result:
        return result[0]['cart_id']
    else:
        create_cart()
        cart_id = get_cart_id()
        return cart_id

def add_to_cart():
    product_id = str(request.vars.product_id)
    qty = str(request.vars.qty)
    cart_id = get_cart_id()
    
    if cart_id != 0:
        if order_item_exists_in_cart(product_id):
            response = 0
        else:
            query = "insert into order_item (cart_id, product_id, qty) VALUES (" + cart_id + ", " + product_id + ", " + qty + ")"
            db.executesql(query)
            response = 1
    return dict(response=response)

def get_cart_items():
    cart_id = get_cart_id()
    query = "select * from order_items where cart_id = " + cart_id
    data = db.executesql(query, as_dict=True)
    return json.dumps(data)

def order_item_exists_in_cart(product_id):
    cart_id = get_cart_id()
    query = "select * from order_item where product_id = " + str(product_id) + " and cart_id = " + str(cart_id)
    result = db.executesql(query)
    if result:
        response = True
    else:
        response = False
    return response
"""