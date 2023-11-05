const router = require("express").Router();
/////////////////////////////////////////////
const {getAllUsersCtrl,
    getUsersProfileCtrl,
    updateUserProfileCtrl,
    getUsersCountCtrl,
    profilePhotoUploadCtrl,
    deleteUserProfileCtrl,
    payment
}=require("../controllers/usersController");
////////////////////////////////////////////
const {verifyTokenAndAdmin,
    verifyTokenAndOnlyUser,
    verifyToken,
    verifyTokenAndAuthorization
}=require("../middlewares/verifyToken");
//////////////////////////////////////////////////////
const validateObjectId=require("../middlewares/validateObjectId");
////////////////////////////////////////////////////
const photoUpload=require("../middlewares/photoUpload");
///////////////////////////////////////////////////
//api/users/profile
router.route("/profile").get(verifyTokenAndAdmin,getAllUsersCtrl);

//api/users/profile/:id
router.route("/profile/:id")
.get(validateObjectId,getUsersProfileCtrl)
.put(validateObjectId,verifyTokenAndOnlyUser,updateUserProfileCtrl)
.delete(validateObjectId,verifyTokenAndAuthorization,deleteUserProfileCtrl); 

//api/users/count
router.route("/count").get(verifyTokenAndAdmin,getUsersCountCtrl);

//api/users/profile/profile-photo-upload
router.route("/profile/profile-photo-upload")
.post(verifyToken,photoUpload.single("image"),profilePhotoUploadCtrl);

///api/users/orders
router.route("/profile/order")
.post(verifyToken,payment);
module.exports=router; 