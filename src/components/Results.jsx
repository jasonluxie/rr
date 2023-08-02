import { useState } from "react";

function Results(restaurants) {
    const [restaurant, setRestaurant] = useState(restaurants);
    console.log(restaurant)
    let encodedName = encodeURI(restaurant.data.name)
    return (
        <div>
            <a
                href={
                    "https://www.google.com/maps/search/?api=1&query=" + encodedName + "&query_place_id=" + restaurant.data.place_id
                }
            >
                {restaurant.data.name}
            </a>
        </div>
    );
}

export default Results;