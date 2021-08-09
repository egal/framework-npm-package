import {EgalConstructor} from "./index";

const constructor = new EgalConstructor({
    modelName: 'user',
    userName: 'user',
    password: 'password',
    url: 'url',
    connectionType: 'axios'
})
const filter = [{
    left: {
        field: 'age',
        operator: 'gt',
        value: 20
    },
    type: 'or',
    right: {
        field: 'age',
        operator: 'lt',
        value: 30
    }
}]

constructor.actionGetItems('monolit', 'axios', undefined, undefined, filter)
