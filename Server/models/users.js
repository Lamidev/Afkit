

// const mongoose = require("mongoose");

// const UserSchema = new mongoose.Schema(
//   {
//     userName: {
//       type: String,
//       required: true,
//       unique: true,
//     },
//     email: {
//       type: String,
//       required: true,
//       unique: true,
//     },
//     password: {
//       type: String,
//       required: true,
//     },
//     role: {
//       type: String,
//       default: "user",
//     },
//     lastLogin: {
//       type: Date,
//       index: true
//     },
//     isVerified: {
//       type: Boolean,
//       default: false,
//     },
//     resetPasswordToken: String,
//     resetPasswordExpiresAt: Date,
//     verificationToken: String,
//     verificationTokenExpiresAt: Date,
//   },
//   { timestamps: true }
// );

// const User = mongoose.model("User", UserSchema);
// module.exports = User;


const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema(
  {
    userName: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      minlength: 3,
      maxlength: 30
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
      match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please fill a valid email address']
    },
    password: {
      type: String,
      required: true,
      minlength: 8
    },
    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user"
    },
    isVerified: {
      type: Boolean,
      default: false
    },
    lastLogin: {
      type: Date,
      index: true // Single field index defined inline
    },
    lastActive: {
      type: Date,
      index: true // Single field index defined inline
    },
    verificationToken: String,
    verificationTokenExpiresAt: Date,
    resetPasswordToken: String,
    resetPasswordExpiresAt: Date
  },
  { 
    timestamps: true,
    toJSON: {
      transform: function(doc, ret) {
        ret.id = ret._id;
        delete ret._id;
        delete ret.__v;
        delete ret.password;
        delete ret.verificationToken;
        delete ret.verificationTokenExpiresAt;
        delete ret.resetPasswordToken;
        delete ret.resetPasswordExpiresAt;
      }
    },
    toObject: {
      transform: function(doc, ret) {
        ret.id = ret._id;
        delete ret._id;
        delete ret.__v;
        delete ret.password;
        delete ret.verificationToken;
        delete ret.verificationTokenExpiresAt;
        delete ret.resetPasswordToken;
        delete ret.resetPasswordExpiresAt;
      }
    }
  }
);

// Compound index example (uncomment if needed)
// UserSchema.index({ role: 1, isVerified: 1 }); 

const User = mongoose.model("User", UserSchema);

module.exports = User;