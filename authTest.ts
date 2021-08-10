import {EgalAuthConstructor} from "./src/Model/AuthConstructor";

let newAuth = new EgalAuthConstructor({modelName: 'User', userName: 'admin', password: 'password', url:'http://breaker-develop.sputnikfund.ru/api', connectionType: 'axios'})
let userData = {email: 'email134@email.com', password: 'password'}
newAuth.registerNewUser(userData).then((data) => {
    console.log('return from promise in test', data)
    egalAuth()
}).catch((error) => {
    console.log(error, 'error from promise')
})


function egalAuth() {
    console.log('egal auth called')
    newAuth.authUser(userData).then((data) => {
        egalLoginToService(data)
        console.log(data, 'user login from test')
    }).catch((error) => {
        console.log(error, 'error from test')
    })
}

function egalLoginToService(data:any) {
    let loginData = { service_name: 'monolit', token: data[0] }
    newAuth.loginToService(loginData).then((dataLoginToService) => {
        console.log(dataLoginToService, 'login to service from test')
    }).catch((error) => {
        console.log(error, 'error from test')
    })
}
