import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";

function WorkoutsCard(props) {
  const { id, workout } = props;
const navigate = useNavigate()
  return (
    <div>

      <div class="card">
        <div class="card-details">
        <h2 class="text-title">
          {workout && workout.name
            ? workout.name.charAt(0).toUpperCase() + workout.name.slice(1)
            : ""}
        </h2>
        <h2 class="text-body">Type: {workout && workout.workoutType
            ? workout.workoutType.charAt(0).toUpperCase() +
              workout.workoutType.slice(1)
            : ""}
        </h2>
        <h3 class="text-body">Difficulty: {workout && workout.expLevel
            ? workout.expLevel.charAt(0).toUpperCase() +
              workout.expLevel.slice(1)
            : ""}
        </h3>
        </div>
        <button onClick={()=>navigate(`/workouts/${id}`)} class="card-button">More...</button>
      </div>
    </div>
  );
}

export default WorkoutsCard;
