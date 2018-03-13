
import Immutable from 'immutable'


const STUDENTID = "STUDENTID";


export const change = (data)=> {
    return {
            type: STUDENTID,
            data: data
        }
};


const initialState = Immutable.Map({
    data : 0
});

export const chageStudentId = (state = initialState, action) => {
    switch (action.type) {
        case STUDENTID:
            return Immutable.Map({
                data: action.data
            });
        default:
            return state;
    }
};



