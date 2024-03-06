import { Link } from "react-router-dom";
function ParkCard(props) {
  const { entry, id } = props;

  return (
    <Link to={`/parkdetails/${id}`}>
      <section>
        <img src={entry.photo} />
        <h4>{entry.name}</h4>
      </section>
    </Link>
  );
}

export default ParkCard;
