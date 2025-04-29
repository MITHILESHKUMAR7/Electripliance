const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const user = require('./models/user');
const bcrypt = require('bcrypt');
const bodyParser = require("body-parser");
const product = require('./models/product');
const organization = require('./models/organization');
const cookieSession = require("cookie-session");
const authenticateuser = require('./middlewares/authenticateuser');
const purchase = require('./models/purchase');
const fs = require('fs');
const app = express();
const PORT = process.env.PORT || 3000;

mongoose.connect('mongodb+srv://webathon:webathon22@webathon.8pff7.mongodb.net/myFirstDatabase?retryWrites=true&w=majority', () => console.log('Database connected'), (err) => {
    console.log(err);
});

app.use(express.static(path.resolve(__dirname, './public')));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.set('view engine', 'ejs');
app.use(
    cookieSession({
        keys: ["randomStringASyoulikehjudfsajk"],
    })
);

//Get Requests
app.get('/', (req, res) => {
    var top;
    if (req.session.user) {
        top = 'logout';
        res.render('index2', { name: req.session.user.name, top: top });
    }
    else {
        top = 'Login/Register';
        res.render('index2', { name: '', top: top });
    }
})

app.get('/register', (req, res) => {
    res.sendFile(path.resolve(__dirname, './public/register.html'));
})

app.get('/adminpanel', (req, res) => {
    res.sendFile(path.resolve(__dirname, './public/admin.html'));
});

app.get('/admin', (req, res) => {
    res.sendFile(path.resolve(__dirname, './public/adminlogin.html'));
});

app.get('/addproduct', (req, res) => {
    res.render('addproduct');
})

app.get('/mobile', (req, res) => {
    const category = 'Mobile Phone';
    var top;
    var name;
    if (!req.session.user) {
        top = 'Login/Register';
        name = '';
    }
    else {
        top = 'Logout';
        name = req.session.user.name;
    }
    product.find({ category }, (err, items) => {
        if (err) {
            console.log(err);
            res.status(500).send('An error occurred', err);
        }
        else {
            res.render('mobile', { items: items, top: top, name: name });
        }
    });
});

app.get('/laptop', (req, res) => {
    const category = 'Laptop';
    var top;
    var name;
    if (!req.session.user) {
        top = 'Login/Register';
        name = '';
    }
    else {
        top = 'Logout';
        name = req.session.user.name;
    }
    product.find({ category }, (err, items) => {
        if (err) {
            console.log(err);
            res.status(500).send('An error occurred', err);
        }
        else {
            res.render('laptop', { items: items, top: top, name: name });
        }
    });
});

app.get('/fan', (req, res) => {
    const category = 'Fan';
    var top;
    var name;
    if (!req.session.user) {
        top = 'Login/Register';
        name = '';
    }
    else {
        top = 'Logout';
        name = req.session.user.name;
    }
    product.find({ category }, (err, items) => {
        if (err) {
            console.log(err);
            res.status(500).send('An error occurred', err);
        }
        else {
            res.render('fan', { items: items, top: top, name: name });
        }
    });
});

app.get('/tv', (req, res) => {
    const category = 'TV';
    var top;
    var name;
    if (!req.session.user) {
        top = 'Login/Register';
        name = '';
    }
    else {
        top = 'Logout';
        name = req.session.user.name;
    }
    product.find({ category }, (err, items) => {
        if (err) {
            console.log(err);
            res.status(500).send('An error occurred', err);
        }
        else {
            res.render('tv', { items: items, top: top, name: name });
        }
    });
});

app.get('/other', (req, res) => {
    const category = 'Other';
    var top;
    var name;
    if (!req.session.user) {
        top = 'Login/Register';
        name = '';
    }
    else {
        top = 'Logout';
        name = req.session.user.name;
    }
    product.find({ category }, (err, items) => {
        if (err) {
            console.log(err);
            res.status(500).send('An error occurred', err);
        }
        else {
            res.render('other', { items: items, top: top, name: name });
        }
    });
});

app.get('/vieworder', (req, res) => {
    purchase.find().distinct('buyer_name', (err, item) => {
        if (err) {
            console.log(err);
            res.send("An error occured");
        }
        else {
            res.render('orders', { item });
        }
    });
});

app.get('/register2', (req, res) => {
    res.sendFile(path.resolve(__dirname, './public/registerorg.html'));
})

app.get('/login', (req, res) => {
    if (req.session.user) {
        req.session.user = null;
    }
    res.sendFile(path.resolve(__dirname, './public/login.html'));
});

app.get('/logout', (req, res) => {
    req.session.user = null;
    if (!req.session.user) {
        res.redirect('back');
    }
});
//Post Requests

app.post('/register', async (req, res) => {
    const { name, email, dob, mobileno, password, confirmpassword } = req.body;
    if (!name || !email || !dob || !mobileno || !password || !confirmpassword) {
        return res.send("Please enter all the fields");
    }
    if (password != confirmpassword) {
        return res.send("Password did not match");
    }
    const doesUserExitsAlreay = await user.findOne({ email });
    if (doesUserExitsAlreay) {
        return res.send("Email already registered");
    }
    //hasing the password
    const hashedPassword = await bcrypt.hash(password, 12);
    const newUser = new user({ name, email, dob, mobileno, password: hashedPassword });
    newUser.save().then(() => res.send("Registration Successful")).catch((err) => res.send(err.message));
});

app.post('/register2', async (req, res) => {
    const { id, name, email, contact, password, confirmpassword, employee1_id, employee2_id, employee3_id, employee1_name, employee2_name, employee3_name } = req.body;
    if (!name || !email || !id || !password || !confirmpassword || !employee1_id || !employee1_name) {
        return res.send("Please enter all the fields");
    }
    if (password != confirmpassword) {
        return res.send("Password did not match");
    }
    const doesUserExitsAlreay = await organization.findOne({ id });
    if (doesUserExitsAlreay) {
        return res.send("Organization already registered");
    }
    //hasing the password
    const hashedPassword = await bcrypt.hash(password, 12);
    const newOrg = new organization({ id, name, email, contact, password: hashedPassword, employee1_id, employee2_id, employee3_id, employee1_name, employee2_name, employee3_name });
    newOrg.save().then(() => res.send("Registration Successful")).catch((err) => res.send(err.message));
});

app.post("/loginind", async (req, res) => {
    const { email, password } = req.body;

    // check for missing filds
    if (!email || !password) return res.send("Please enter all the fields");

    const doesUserExits = await user.findOne({ email });

    if (!doesUserExits) return res.send("Invalid email");

    const doesPasswordMatch = await bcrypt.compare(
        password,
        doesUserExits.password
    );

    if (!doesPasswordMatch) return res.send("Incorrect password");

    req.session.user = {
        type: 1,
        email,
        name: doesUserExits.name,
        mobileno: doesUserExits.mobileno
    };
    res.redirect('/');
    console.log(req.session.user);
});

app.post("/loginorg", async (req, res) => {
    const { id, employee_id, password } = req.body;

    // check for missing filds
    if (!id || !password || !employee_id) return res.send("Please enter all the fields");

    const doesUserExits = await organization.findOne({ id });

    if (!doesUserExits) return res.send("Invalid organization id");

    const doesPasswordMatch = await bcrypt.compare(
        password,
        doesUserExits.password
    );

    if (!doesPasswordMatch) return res.send("Incorrect password");
    if (employee_id === doesUserExits.employee1_id || employee_id === doesUserExits.employee2_id || employee_id === doesUserExits.employee3_id) {
        var employee_name;
        if (employee_id === doesUserExits.employee1_id) {
            employee_name = doesUserExits.employee1_name;
        }
        else if (employee_id === doesUserExits.employee2_id) {
            employee_name = doesUserExits.employee2_name;
        }
        else {
            employee_name = doesUserExits.employee3_name;
        }
        req.session.user = {
            type: 2,
            id,
            email: doesUserExits.email,
            name: doesUserExits.name,
            contact: doesUserExits.contact,
            employee_id: employee_id,
            employee_name: employee_name
        };

        res.redirect('/');
        console.log(req.session.user);
    }
    else {
        return res.send("Invalid Employee Id")
    }
});

app.post('/purchase', authenticateuser, (req, res) => {
    const { product_id, product_name, product_price } = req.body;
    const buyer_type = req.session.user.type;
    const buyer_name = req.session.user.name;
    const email = req.session.user.email;
    const employee_id = req.session.user.employee_id;
    const employee_name = req.session.user.employee_name;
    var contact;
    if (req.session.user.type === 1) {
        contact = req.session.user.mobileno;
    }
    else {
        contact = req.session.user.contact;
    }
    const date = new Date();
    const purchase = { product_id, product_name, product_price, buyer_type, buyer_name, date, email, contact, employee_id, employee_name };
    if (buyer_type === 1) {
        res.render('purchase', { purchase });
    }
    else {
        res.render('purchase2', { purchase })
    }
    console.log(purchase);
});

app.post('/orderplaced', (req, res) => {
    const { product_id, product_name, product_price, buyer_type, buyer_name, email, contact, date } = req.body;
    const delivery_address = req.body.delivery_address;
    var employee_id;
    var employee_name;
    var purchased_for;
    if (buyer_type === '2') {
        employee_id = req.body.employee_id;
        employee_name = req.body.employee_name;
        purchased_for = req.body.purchased_for;
    }
    else {
        employee_id = -1;
        employee_name = -1;
        purchased_for = 'Self';
    }
    console.log(employee_id);
    console.log(employee_name);
    console.log(req.body.employee_id);
    console.log(req.body.employee_name);
    const newpurchase = new purchase({ product_id, product_name, product_price, buyer_type, buyer_name, email, employee_id, employee_name, contact, date, delivery_address, purchased_for });
    newpurchase.save().then(() => res.send("Order Placed"));
});


app.post('/loginadmin', (req, res) => {
    const { id, password } = req.body;
    if (!id || !password) return res.send("Please Enter aa the fields");
    if (id === 'mithilesh' && password == 'kumar@7282') {
        req.session.admin = {
            type: 3,
        }
        res.redirect('/vieworder')
    }
    else {
        res.send("Invalid ID or Password");
    }
})

app.post('/viewfor', (req, res) => {
    const buyer_name = req.body.buyer_name;
    purchase.find({ buyer_name }, (err, item) => {
        if (err) {
            res.send("An error occured");
        }
        else {
            res.render('orderby', { item });
        }
    });
});

app.listen(PORT, () => {
    console.log("Server started");
});