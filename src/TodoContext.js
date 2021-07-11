import React, {useReducer, createContext, useContext, useRef, useEffect} from "react";
import * as api from './api'; // api에서 내보낸 모든 함수들을 불러옴

// const initialTodos = [
//   {
//     id: 1,
//     text: '프로젝트 생성하기',
//     done: true
//   },
//   {
//     id: 2,
//     text: '컴포넌트 스타일링하기',
//     done: false
//   },
//   {
//     id: 3,
//     text: 'Context 만들기',
//     done: false
//   },
//   {
//     id: 4,
//     text: '기능 구현하기',
//     done: false
//   }
// ];

export function createAsyncDispatcher(type, promiseFn) {
  // 성공, 실패에 대한 액션 타입 문자열을 준비
  const SUCCESS = `${type}_SUCCESS`;
  const ERROR = `${type}_ERROR`;

  // actionHandler(dispatch, 1,2,3)이라고 쓰면 rest 안에 1,2,3이 담김
  async function actionHandler(dispatch, ...rest) {
    dispatch({ type }); // 요청 시작됨
    try {
      // 파라미터로 받아온 promiseFn 호출 (...rest로 받아온거 풀어줄 것)
      const data = await promiseFn(...rest); // rest 배열을 spread로 넣어줌
      dispatch({ // 성공
        type: SUCCESS,
        data
      });
    } catch (e) {
      dispatch({ // 실패
        type: ERROR,
        error: e
      });
    }
  }
  return actionHandler; // 만든 함수를 반환
}

const initialAsyncState = {
  loading: false,
  data: null,
  error: null
};
// 로딩 중일 때 users와 user 상태 대체할 객체
const loadingState = {
  loading: true,
  data: null,
  error: null
};
// data를 파라미터로 가져와서 특정 개체를 생성 / 성공했을 때의 상태 만들어주는 함수
const success = (data) => ({
  loading: false,
  data,
  error:null
});
// error를 파라미터로 가져옴 / 실패했을 때의 상태를 만들어주는 함수
const error = (e) => ({
  loading: false,
  data: null,
  error: e
});

const getHandler = createAsyncHandler('GET_TODOS', 'todos');
const postHandler = createAsyncHandler('POST_TODOS', 'todos');
const putHandler = createAsyncHandler('PUT_TODOS', 'todos');
const deleteHandler = createAsyncHandler('DELETE_TODOS', 'todos');

// type => action type / key => users, user
export function createAsyncHandler(type, key) {
  // 성공, 실패에 대한 액션 타입 문자열 준비
  const SUCCESS = `${type}_SUCCESS`;
  const ERROR = `${type}_ERROR`;

  // 함수를 새로 만들어서
  function handler(state, action) {
    switch (action.type) {
      case type:
        return {
          ...state, // todos를 유지 (불변성 유지)
          [key]: loadingState
        };
      case SUCCESS:
        return {
          ...state,
          [key]: success(action.data)
        };
      case ERROR:
        return {
          ...state,
          [key]: error(action.error)
        };
      default:
        return state;
    }
  }
  return handler; // 반환
}

// export async function getTodos(dispatch) {
//   dispatch({ type: 'GET_TODOS'});
//   try {
//     const response = await axios.get(
//         'http://localhost:8080/api/todo'
//     );
//     dispatch({
//       type: 'GET_TODOS_SUCCESS',
//       data: response.data
//     });
//   } catch (e) {
//     dispatch({
//       type: 'GET_TODOS_ERROR',
//       error: e
//     });
//   }
// }

async function todoReducer(state, action) {
  switch (action.type) {
    // case 'GET_TODOS':
    //
    //   const response = await axios.get(
    //       'http://localhost:8080/api/todo'
    //   );
    //   try{
    //     return {
    //       ...state,
    //       todo: loadingState
    //     }
    //   } catch (e) {
    //
    //     return;
    //   }
    // case 'GET_TODOS':
    //   return {
    //     ...state,
    //     users: loadingState
    //   };
    // case 'GET_TODOS_SUCCESS':
    //   return {
    //     ...state,
    //     users: success(action.data)
    //   };
    // case 'GET_TODOS_ERROR':
    //   return {
    //     ...state,
    //     users: error(action.error)
    //   };
    case 'GET_TODOS':
    case 'GET_TODOS_SUCCESS':
    case 'GET_TODOS_ERROR':
      return getHandler(state, action);
    case 'POST_TODOS':
    case 'POST_TODOS_SUCCESS':
    case 'POST_TODOS_ERROR':
      return postHandler(state, action);
    case 'PUT_TODOS':
    case 'PUT_TODOS_SUCCESS':
    case 'PUT_TODOS_ERROR':
      return putHandler(state, action);
    case 'DELETE_TODOS':
    case 'DELETE_TODOS_SUCCESS':
    case 'DELETE_TODOS_ERROR':
      return deleteHandler(state, action);
    // case 'CREATE':
    //   console.log(action.todo);
    //   return state.concat(action.todo);
    // case 'TOGGLE':
    //   return state.map(todo =>
    //     todo.id === action.id ? { ...todo, done: !todo.done } : todo
    //   );
    // case 'REMOVE':
    //   return state.filter(todo => todo.id !== action.id);
    default:
      throw new Error(`Unhandled action type: ${action.type}`);
  }
}

const TodoStateContext = createContext(null);
const TodoDispatchContext = createContext(null);
const TodoNextIdContext = createContext();

export function TodoProvider({ children }) {
  const [state, dispatch] = useReducer(todoReducer, getTodos);
  const nextId = useRef(5);

  const { loading, data: todos, error } = state;

  const fetchData = () => {
    getTodos(dispatch);
    console.log(state);
  };

  useEffect(() => {
    fetchData()
  }, [dispatch]);

  if (loading) return <div>로딩중..</div>
  if (error) return <div>에러가 발생했습니다.</div>
  if (!todos) return null;

  console.log(state);

  return (
    <TodoStateContext.Provider value={state}>
      <TodoDispatchContext.Provider value={dispatch}>
        <TodoNextIdContext.Provider value={nextId}>
          {children}
        </TodoNextIdContext.Provider>
      </TodoDispatchContext.Provider>
    </TodoStateContext.Provider>
  );
}

// 커스텀 Hooks
// TodoList에서 사용
export function useTodoState() {
  const context = useContext(TodoStateContext);
  if (!context) {
    throw new Error("Cannot find TodoProvider");
  }
  return context;
}

// TodoCreate에서 사용
export function useTodoDispatch() {
  const context = useContext(TodoDispatchContext);
  if (!context) {
    throw new Error("Cannot find TodoProvider");
  }
  return context;
}
export function useTodoNextId() {
  const context = useContext(TodoNextIdContext);
  if (!context) {
    throw new Error("Cannot find TodoProvider");
  }
  return context;
}

export const getTodos = createAsyncDispatcher('GET_TODOS', api.getTodos);
export const postTodos = createAsyncDispatcher('POST_TODOS', api.postTodos);
export const putTodos = createAsyncDispatcher('PUT_TODOS', api.putTodos);
export const deleteTodos = createAsyncDispatcher('DELETE_TODOS', api.deleteTodos);
