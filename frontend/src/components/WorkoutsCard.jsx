import { Link } from "react-router-dom";


function WorkoutsCard (props) {
    
    const {id, workout} = props

    return (
        <div>
            <Link to={`/workouts/${id}`}>
                <h2>{workout.workoutType}</h2>
                <h3>{workout.expLevel}</h3> 
            </Link>
        </div>
    )
}

export default WorkoutsCard;