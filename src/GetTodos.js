import React, { useEffect, useState } from 'react';
import useAsync from './useAsync';
import axios from "axios";

async function getTodos() {
    const response = await axios({
        method: 'GET',
        url: 'http://localhost:8080/api/todo',
    });
    return response.data;
}

function GetTodos () {
    const [state, refetch] = useAsync(getTodos);

    const { loading, data: getTodos, error } = state;

    if (loading) return <div>로딩중..</div>
    if (error) return <div>에러가 발생했습니다.</div>
    if (!getTodos) return null;

    return <ul>
        {getTodos.map(todo => <li key={todo.id}>
            {todo.id} ({todo.contents})
        </li>)}
    </ul>;
}

export default GetTodos;