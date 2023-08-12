import React from "react";

import { increment, decrement, reset, incrementByAmount } from "./counterSlice";
import { useAppDispatch, useAppSelector } from "../../app/hooks";

const Counter: React.FC = () => {
  const [incrementAmount, setIncrementAmount] = React.useState<number>(0);

  const addValue = Number(incrementAmount) || 0;
  const count = useAppSelector((state) => state.counter.count);
  const dispatch = useAppDispatch();

  const resetAll = () => {
    setIncrementAmount(0);
    dispatch(reset());
  };
  return (
    <section>
      <p>{count}</p>
      <div>
        <button onClick={() => dispatch(increment())}>+</button>
        <button onClick={() => dispatch(decrement())}>-</button>
      </div>

      <input
        type="string"
        value={incrementAmount}
        onChange={(e) => setIncrementAmount(Number(e.target.value))}
      />

      <div>
        <button onClick={() => dispatch(incrementByAmount(addValue))}>
          Add Amount
        </button>
        <button onClick={resetAll}>Reset</button>
      </div>
    </section>
  );
};

export default Counter;
