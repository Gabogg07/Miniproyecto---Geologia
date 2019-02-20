export const ADD_COLUMN = "ADD_COLUMN";
export const ADD_LAYER = "ADD_LAYER";
export const SAVE_NAME = "SAVE_NAME";

/**
* This is the action we will call from our component whenever the user presses a button. Literally every letter that they will type, this action will be called with the new value in the text input field. Pay attention to the type and payload in this function. This is what we will use in the reducer to "modify" our model with the new values.
**/
export function addColumn(name){
    return {
        type: ADD_COLUMN,
        payload:{
            name
        }
    }
}

/**
This is the action we will call when the user presses the save name button. Notice how we don't pass any value in. That is because the reducer already holds that value. Also there is no payload. The reason for that is the reducer doesn't need one. There is no extra information needed for the reducer step.
Also, normally this would call an api endpoint and all that jazz, but for brevity's sake I won't include that.
**/
export function saveName(){
 return {
   type: SAVE_NAME
 }
}