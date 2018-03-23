
import Immutable from 'immutable'


const USERID = "USERID";


export const change = (data)=> {
    return {
            type: USERID,
            data: data
        }
};


const initialState = Immutable.Map({
    data : 0
});

export const changeUserId = (state = initialState, action) => {
    switch (action.type) {
        case USERID:
            return Immutable.Map({
                data: action.data
            });
        default:
            return state;
    }
};



