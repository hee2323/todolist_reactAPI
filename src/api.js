import axios from "axios";

export async function getTodos() {
    const response = await axios.get(
        'http://localhost:8080/api/todo'
    );
    return response.data;
}

export async function postTodos(todo) {
    const newTodo = {
        ...todo,
        contents: todo.contents,
        created_user: todo.created_user
    }
    const response = await axios.post(
        'http://localhost:8080/api/todo', {
            newTodo
        }
    );
    return response.data;
}

// export async function putTodos(todo) {
export async function putTodos(id) {
    const newTodo = {
        id
        // ...todo,
        // id: todo.id,
        // updated_user: todo.updated_user
    }
    const response = await axios.put(
        'http://localhost:8080/api/todo',
        {
            newTodo
        }
    );
    return response.data;
}

export async function deleteTodos(id) {
    const response = await axios.delete(
        'http://localhost:8080/api/todo',
        // `http://localhost:8080/api/todo/${id}`,
        { id }
    );
    return response.data;
}
