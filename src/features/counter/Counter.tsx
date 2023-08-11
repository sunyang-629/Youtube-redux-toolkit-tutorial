import React from "react";

import { increment, decrement } from "./counterSlice";
import { useAppDispatch, useAppSelector } from "../../app/hooks";

const Counter: React.FC = () => {
  const count = useAppSelector((state) => state.counter.count);
  const dispatch = useAppDispatch();
  return (
    <section>
      <p>{count}</p>
      <div>
        <button onClick={() => dispatch(increment())}>+</button>
        <button onClick={() => dispatch(decrement())}>-</button>
      </div>
    </section>
  );
};

export default Counter;
