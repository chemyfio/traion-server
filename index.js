var express = require('express');
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var bodyParser = require('body-parser');
var Chance = require('chance');
var chance = new Chance();

var app = express();

//for parsing application/json
app.use(bodyParser.json());

//for parsing application/xwww-
app.use(bodyParser.urlencoded({extended: true}));

mongoose.Promise = global.Promise;
mongoose.connect('mongodb://root:root@ds141284.mlab.com:41284/tracer',{useMongoClient: true});

var userSchema = mongoose.Schema({
    email : String,
    idToken : String,
    point : Number,
	urlProfilePicture: String
}, {versionKey: false});
var User = mongoose.model("User", userSchema);

var reportSchema = mongoose.Schema({
    idUser : String,
    detailPlace : String,
    latitude : Number,
    longtitude : Number,
    time : String,
    urlContent : String,
    fileType : String,
    violationType : String,
    information : String,
    status : String
}, {versionKey: false});
var Report = mongoose.model("Report", reportSchema);

var adminSchema = mongoose.Schema({
    username : String,
    password : String
}, {versionKey: false});
var Admin = mongoose.model("Admin", adminSchema);

var voucherSchema = mongoose.Schema({
    exchangePoint : Number,
    expiredPeriod : Number,
    value : Number 
}, {versionKey: false});
var Voucher = mongoose.model("Voucher", voucherSchema);

var voucherUserSchema = mongoose.Schema({
    idVoucher : String,
    idUser : String,
    firstDate : String,
    expiredDate : String,
    alreadyUsed : Boolean 
}, {versionKey: false});
var VoucherUser = mongoose.model("VoucherUser", voucherUserSchema);

var rewardSchema = mongoose.Schema({
    idUser : String,
    amount: Number,
    accountNumber: String,
    hasReceived : Boolean 
}, {versionKey: false});
var Reward = mongoose.model("Reward", rewardSchema);

app.post('/users', function(req, res){
    var userInfo = req.body;
    console.log(userInfo);
    
    if(!userInfo.email || !userInfo.idToken){
        res.status(400);
        res.json({message: "Bad Request"});
    }else{
        var newUser = new User({
            email: userInfo.email,
            idToken: userInfo.idToken,
			urlProfilePicture: userInfo.urlProfilePicture,
            point: 5
        });
        
        newUser.save(function(err, User){
            if(err)
                res.send({message: "Database error", type: "error"});
            else
                res.json(newUser);
        });
    }
});

app.post('/admins', function(req, res){
    var adminInfo = req.body;
    if(!adminInfo.username || !adminInfo.password){
        res.status(400);
        res.json({message: "Bad Request"});
    }else{
        var newAdmin = new Admin({
            username : adminInfo.username,
            password : adminInfo.password
        });
        
        newAdmin.save(function(err, User){
            if(err)
                res.send({message: "Database error", type: "error"});
            else
                res.json(newAdmin);
        });
    }
});

app.post('/reports', function(req, res){
    var reportInfo = req.body;
    if(!reportInfo.idUser || !reportInfo.urlContent|| !reportInfo.fileType|| !reportInfo.violationType){
        res.status(400);
        res.json({message: "Bad Request"});
    }else{
        var newReport = new Report({
            idUser : reportInfo.idUser,
            detailPlace : reportInfo.detailPlace,
            latitude : reportInfo.latitude,
            longtitude : reportInfo.longtitude,
            time : reportInfo.time,
            urlContent : reportInfo.urlContent,
            fileType : reportInfo.fileType,
            violationType : reportInfo.violationType,
            information : reportInfo.information,
            status : "unverified"
        });
        
        newReport.save(function(err, User){
            if(err)
                res.send({message: "Database error", type: "error"});
            else
                res.json(newReport);
        });
    }
});

app.post('/rewards', function(req, res){
    var rewardInfo = req.body;
    if(!rewardInfo.idUser || !rewardInfo.accountNumber || rewardInfo.hasReceived==false){
        res.status(400);
        res.json({message: "Bad Request"});
    }else{
        var newReward = new Reward({
            idUser : rewardInfo.idUser,
            amount: rewardInfo.amount,
            accountNumber: rewardInfo.accountNumber,
            hasReceived : rewardInfo.hasReceived
        });
        
        newReward.save(function(err, User){
            if(err)
                res.send({message: "Database error", type: "error"});
            else
                res.json(newReward);
        });
    }
});

app.post('/voucher-user', function(req, res){
    var voucherUserInfo = req.body;
    if(!voucherUserInfo.idVoucher || !voucherUserInfo.idUser|| !voucherUserInfo.firstDate|| !voucherUserInfo.expiredDate){
        res.status(400);
        res.json({message: "Bad Request"});
    }else{
        var newVoucherUser = new VoucherUser({
            idVoucher : voucherUserInfo.idVoucher,
            idUser : voucherUserInfo.idUser,
            firstDate : voucherUserInfo.firstDate,
            expiredDate : voucherUserInfo.expiredDate,
            alreadyUsed : voucherUserInfo.alreadyUsed 
        });
        
        newVoucherUser.save(function(err, User){
            if(err)
                res.send({message: "Database error", type: "error"});
            else
                res.json(newVoucherUser);
        });
    }
});

app.post('/vouchers', function(req, res){
    var voucherInfo = req.body;
    if(!voucherInfo.exchangePoint || !voucherInfo.expiredPeriod|| !voucherInfo.value){
        res.status(400);
        res.json({message: "Bad Request"});
    }else{
        var newVoucher = new Voucher({
            exchangePoint : voucherInfo.exchangePoint,
            expiredPeriod : voucherInfo.expiredPeriod,
            value : voucherInfo.value
        });
        
        newVoucher.save(function(err, User){
            if(err)
                res.send({message: "Database error", type: "error"});
            else
                res.json(newVoucher);
        });
    }
});
app.post('/verification', function(req, res){
    var random = chance.integer({min: 100000, max: 999999 });
    res.json({"code":random});
});

app.get('/reports',function(req, res){
    Report.find(function(err, response){
        res.json(response);
    });
});

app.get('/reports/unverified',function(req, res){
    Report.find({status: "unverified"},function(err, response){
        res.json(response);
    });
});

app.get('/reports/processed',function(req, res){
    Report.find({status: "processed"},function(err, response){
        res.json(response);
    });
});

app.get('/reports/verified',function(req, res){
    Report.find({status: "verified"},function(err, response){
        res.json(response);
    });
});

app.get('/reports/invalid',function(req, res){
    Report.find({status: "invalid"},function(err, response){
        res.json(response);
    });
});

app.get('/reports/:id',function(req, res){
    Report.findById(req.params.id, function(err, response){
        res.json(response);
    });
});

app.get('/rewards/:id',function(req, res){
    Reward.findOne({idUser: req.params.id}, function(err, response){
        res.json(response);
    });
});

app.get('/rewards',function(req, res){
    Reward.find(function(err, response){
        res.json(response);
    });
});

app.get('/admins',function(req, res){
    Admin.find(function(err, response){
        res.json(response);
    });
});

app.get('/admins/:username',function(req, res){
    Admin.findOne({username:req.params.username}, function(err, response){
        res.json(response);
    });
});

app.get('/vouchers/:idUser/:idVoucher',function(req, res){
	var idu = req.params.idUser;
	var idv = req.params.idVoucher;
	
	var voucher;
	Voucher.find({IdVoucher: idv},function(err, response){
        voucher = response;
    });
	
	var voucherUser;
    VoucherUser.find({idUser: idu, IdVoucher: idv},function(err, response){
		voucherUser = response;
		var date = voucherUser.expiredDate.split("-");
		var mon = date[1]+1;
		voucherUser.expiredDate = date[0].concat("-",mon,"-",date[2]);
		res.json({_id: voucherUser._id, firstDate: voucherUser.firstDate, expiredDate: voucherUser.expiredDate, value: voucher.value, alreadyUsed: voucher.alreadyUsed});
    });
	
	
});

app.get('/voucher',function(req, res){
    Voucher.find(function(err, response){
        res.json(response);
    });
});

app.get('/voucher-user',function(req, res){
    VoucherUser.find(function(err, response){
        res.json(response);
    });
});

app.get('/voucher-user/:idUser',function(req, res){
    VoucherUser.find({idUser: req.params.idUser},function(err, response){
        res.json(response);
    });
});

app.get('/users',function(req, res){
    User.find(function(err, response){
        res.json(response);
    });
});

app.get('/users-email/:email',function(req, res){
    User.find({email: req.params.email},function(err, response){
        res.json(response);
    });
});

app.get('/users-id-token/:idToken',function(req, res){
    User.find({idToken: req.params.idToken},function(err, response){
        res.json(response);
    });
});

app.get('/users-id/:id',function(req, res){
    var id = req.params.id;
    User.findById(id, function(err, response){
        res.json(response);
    });
});

app.put('/admins/:username', function(req, res){
    var username = req.params.username;
    Admin.findOneAndUpdate(username, req.body, {new: true},function(err, response){
        if(err) res.json({message: "Error in updating person with username " + req.params.username});
        res.json(response);
    });
});

app.put('/reports/:id', function(req, res){
    Report.findOneAndUpdate({_id:req.params.id}, req.body, {new: true},function(err, response){
        if(err) res.json({message: "Error in updating person with id " + req.params.id});
        res.json(response);
    });
});

app.put('/rewards/:id', function(req, res){
    Reward.findByIdAndUpdate(req.params.id, req.body, {new: true},function(err, response){
        if(err) res.json({message: "Error in updating person with id " + req.params.id});
        res.json(response);
    });
});

app.put('/users-point/:id', function(req, res){
    var id = req.params.id;
    User.findByIdAndUpdate(id, req.body, {new: true},function(err, response){
        if(err) res.json({message: "Error in updating person with id " + req.params.id});
        res.json(response);
    });
});

app.put('/users/:idToken', function(req, res){
    User.findOneAndUpdate({idToken:req.params.idToken}, req.body, {new: true},function(err, response){
        if(err) res.json({message: "Error in updating person with idToken " + req.params.idToken});
        res.json(response);
    });
});

app.put('/voucher-user/:id', function(req, res){
    var id = req.params.id;
    VoucherUser.findByIdAndUpdate(id, req.body, {new: true},function(err, response){
        if(err) res.json({message: "Error in updating person with id " + req.params.id});
        res.json(response);
    });
});

app.delete('/reports-delete/:id',function(req, res){
	Report.findByIdAndRemove(req.params.id, function(err, response){
		if(err) res.json({message: "Error in deleting record id " + req.params.id});
		else res.json({message: "Person with id " + req.params.id + " removed."});
	});
});

var port = process.env.PORT || 8080;
app.listen(port, function() {
	console.log('Node.js listening on port ' + port);
});
