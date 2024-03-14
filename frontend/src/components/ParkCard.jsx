import { Link } from "react-router-dom";
function ParkCard(props) {
  const { entry, id } = props;

  return (
    <Link to={`/parkdetails/${id}`}>
      <section className="park-card">
        <h4>{entry.name}</h4>
        <img src={entry.photo} />
      </section>
    </Link>
  );
}

export default ParkCard;
