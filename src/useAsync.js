import React, { useReducer, useEffect, useCallback } from "react";

// // LOADING, SUCCESS, ERROR
// export function reducer(state, action) {
//     switch (action.type) {
//         case 'LOADING':
//             return {
//                 loading: true,
//                 data: null,
//                 error: null,
//             };
//         case 'SUCCESS':
//             return {
//                 loading: false,
//                 data: action.data,
//                 error: null,
//             };
//         case 'ERROR':
//             return {
//                 loading: false,
//                 data: null,
//                 error: action.error,
//             };
//         default:
//             throw new Error(`Unhandled action type: ${action.type}`);
//     }
// }

// // callback => api 호출 함수 / deps => useEffect에 넣을 두번째 파라미터 그대로 받아와서 사용
// export default function useAsync(callback, deps = []) {
//     const [state, dispatch] = useReducer(reducer, {
//         loading: false,
//         data: null,
//         error: null
//     });
//
//     const fetchData = useCallback(async () => {
//         dispatch({ type: 'LOADING' });
//         try {
//             const data = await callback();
//             dispatch({ type: 'SUCCESS', data });
//         } catch (e) {
//             dispatch({ type: 'ERROR', error: e });
//         }
//     }, [callback]);
//
//     useEffect(() => {
//         fetchData();
//     }, deps);
//
//     return [state, fetchData];
// }
