//use to remove some sensitive info of user
class ProfileResponse{
    constructor(user){
        if (user._id) this._id = user._id
        if (user.username) this.username = user.username
        if (user.name) this.name = user.name
        if (user.email) this.email = user.email
        if (user.phone) this.phone = user.phone
        if (user.birthday) this.birthday = user.birthday
        if (user.gender) this.gender = user.gender
        if (user.addresses) this.addresses = user.addresses
    }
}

module.exports = ProfileResponse