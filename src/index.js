import { createStore, applyMiddleware } from "redux";
import thunkMiddleware from "redux-thunk";
import { render } from "react-dom";
import { Provider, connect } from "react-redux";
import React from "react";

const initialState = {
  characters: [],
  isLoading: false,
  error: null,
};

const FETCH_CHARACTERS_REQUEST = "FETCH_CHARACTERS_REQUEST";
const FETCH_CHARACTERS_SUCCESS = "FETCH_CHARACTERS_SUCCESS";
const FETCH_CHARACTERS_FAILURE = "FETCH_CHARACTERS_FAILURE";

function fetchCharactersRequest() {
  return {
    type: FETCH_CHARACTERS_REQUEST,
  };
}

function fetchCharactersSuccess(characters) {
  return {
    type: FETCH_CHARACTERS_SUCCESS,
    payload: characters,
  };
}

function fetchCharactersFailure(error) {
  return {
    type: FETCH_CHARACTERS_FAILURE,
    payload: error,
  };
}

function fetchCharacters() {
  return function (dispatch) {
    dispatch(fetchCharactersRequest());

    return fetch("https://rickandmortyapi.com/api/character")
      .then((response) => response.json())
      .then((json) => dispatch(fetchCharactersSuccess(json.results)))
      .catch((error) => dispatch(fetchCharactersFailure(error)));
  };
}

function charactersReducer(state = initialState, action) {
  switch (action.type) {
    case FETCH_CHARACTERS_REQUEST:
      return { ...state, isLoading: true };
    case FETCH_CHARACTERS_SUCCESS:
      return { ...state, isLoading: false, characters: action.payload };
    case FETCH_CHARACTERS_FAILURE:
      return { ...state, isLoading: false, error: action.payload };
    default:
      return state;
  }
}

const store = createStore(charactersReducer, applyMiddleware(thunkMiddleware));

function CharacterList({ characters, isLoading, error }) {
  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  return (
    <ul className="character-list">
      {characters.map((character) => (
        <li className="character-list__item" key={character.id}>
          <div className="character-list__name">{character.name}</div>
          <img className="character-list__image" src={character.image} />
        </li>
      ))}
    </ul>
  );
}

function mapStateToProps(state) {
  return {
    characters: state.characters,
    isLoading: state.isLoading,
    error: state.error,
  };
}

const ConnectedCharacterList = connect(mapStateToProps)(CharacterList);

render(
  <Provider store={store}>
    <ConnectedCharacterList />
  </Provider>,
  document.getElementById("root")
);

store.dispatch(fetchCharacters());
