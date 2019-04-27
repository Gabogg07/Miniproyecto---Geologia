//import the actions file we defined earlier
import * as constants from './actions.js';

/** 
The initial state is used to define your reducer. Usually you would just set this to default values and empty strings. The reason this is needed is so that when using these values you are guaranteed to at least have some default value. Think of it as the default constructor.
**/
const initialState = {
     nombreColumna: 1,
     columnas:['capas','fosiles', 'notas'],
     capas: [
             {
              frequency: 4,
              letter: 'capa1',
              lithography : 'localImage'
            },{
              frequency: 2,
              letter: 'capa2',
              lithography : 'localImage'
            },{
              frequency: 1,
              letter: 'capa3',
              lithography : 'localImage'
            },


            ],
     isSaved: false
} 

/**
This action part is the part that will "listen" for emitted actions. So the saveName and modifyName functions that we defined earlier will be handled in here. The action parameter is what is being returned (the type and payload) in the functions above.
**/
function Columna(state=initialState, action){
  switch (action.type){
/**
in REDUX the state is immutable. You must always return a new one, which is why use the ES6 spread operator to copy the values from the states that's passed in.
**/
    case constants.ADD_COLUMN:
        let nuevo = state.nombreColumna + 1;

        state.columnas.push(nuevo);
        
        console.log(nuevo);
        return {
         ...state,
         nombreColumna:nuevo
      }
    case constants.ADD_LAYER:
      return {
         ...state,
         nombreColumna:nuevo
      }

    case constants.SAVE_NAME:
      return {
           ...state, 
           isSaved:!state.isSaved
       }

    case constants.NEW_COLUMN:
    console.log(action.payload.layers)
      return {
        ...state,
        capas: action.payload.layers,
        name: action.payload.name
      }     
    default:
      return state
   }
}
export default Columna;
