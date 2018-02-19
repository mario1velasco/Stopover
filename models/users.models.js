const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const SALT_WORK_FACTOR = 10;



const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Name is required']
    },
    email: {
        type: String,
        lowercase: true,
        required: [true, 'Email is required'],
        unique: true
    },

    social: {
        googleId: String
    },
    
    password: {
        type: String,
        required: [true, 'User needs a password']
    },
    imgUrl: {
        type: String,
        default: 'https://upload.wikimedia.org/wikipedia/commons/a/ac/No_image_available.svg'
      },
    country: {
        type: String,
        required: false
    } 

    
}, { timestamps: true });

userSchema.pre('save', function (next) {
    const user = this;
    if (!user.isModified('password')) {
        return next();
    }

    bcrypt.genSalt(SALT_WORK_FACTOR)
        .then(salt => {
            bcrypt.hash(user.password, salt)
                .then(hash => {
                    user.password = hash;
                    next();
                })
        })
        .catch(error => next(error));
});

userSchema.methods.checkPassword = function (password) {
    return bcrypt.compare(password, this.password);
}





const User = mongoose.model('User', userSchema);
module.exports = User;