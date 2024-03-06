function ParkCard(props) {
  const { entry } = props;

  return (
    <div>
      ParkCard
      <section >
        <h4>{entry.name}</h4>
      </section>
    </div>
  );
}

export default ParkCard;
