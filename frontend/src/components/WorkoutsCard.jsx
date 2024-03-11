import { Link } from "react-router-dom";


function WorkoutsCard (props) {
    
    const {id, workout} = props

    return (
        <div>
            <Link to={`/workouts/${id}`}>
                <h2>{workout && workout.name ? (workout.name.charAt(0).toUpperCase() + workout.name.slice(1)) : ("")}</h2>
                <h2>{workout && workout.workoutType ? (workout.workoutType.charAt(0).toUpperCase() + workout.workoutType.slice(1)) : ("")}</h2>
                <h3>{workout && workout.expLevel ? (workout.expLevel.charAt(0).toUpperCase() + workout.expLevel.slice(1)): ("")}</h3> 
            </Link>
        </div>
    )
}

export default WorkoutsCard;