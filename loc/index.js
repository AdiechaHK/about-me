const play = () => document.getElementsByTagName('audio')[0].play()
const pause = () => document.getElementsByTagName('audio')[0].pause()

const data = {
  variation: 1000,
  target: {lat:22.339898922906237, lng: 70.80889506805345},
  current: {}
}

const checkInside = () => {
  let delta = 1/data.variation;
  let dlat = data.current.lat - data.target.lat;
  let dlng = data.current.lng - data.target.lng;
  dlat *= dlat < 0 ? -1: 1;
  dlng *= dlng < 0 ? -1: 1;
  return (dlat <= delta && dlng <= delta);
}

const updateContent = () => {
  let cnt = `Current: (${data.current.lat?.toFixed(3)}, ${data.current.lng?.toFixed(3)}) / Target: (${data.target.lat?.toFixed(3)}, ${data.target.lng?.toFixed(3)})`;
  document.getElementById("data").innerHTML = cnt
  checkInside() ? play(): pause();
}

const setCurrent = coords => {
  data.current = coords
  updateContent()
} 
const setTarget = coords => {
  data.target = coords
  updateContent()
} 


function initMap() {
  const map = new google.maps.Map(document.getElementById("map"), {
    zoom: 14,
    center: data.target,
  });

  const removeActive = () => {
    let btns = document.getElementsByClassName('btn');
    for (i in btns) {
      if(!isNaN(i)) {
        let btn = btns[i];
        if(btn.classList.contains("active")) {
          btn.classList.remove("active");
        }
      }
    }
  }

  const btnClickListener = event => {
    removeActive()
    event.target.classList.add("active");
    data.variation = ({
      "small": 1000,
      "medium": 500,
      "large": 100
    })[event.target.getAttribute("id")]
  }

  const setListners = () => {
    let btns = document.getElementsByClassName('btn');
    for (i in btns) {
      if(!isNaN(i)) {
        let btn = btns[i];
        btn.addEventListener("click", btnClickListener)
      }
    }
  }

  setListners();

  const getSquare = co => {
    const points = [
      {x:-1,y:-1},
      {x:-1,y:1},
      {x:1,y:1},
      {x:1,y:-1},
      {x:-1,y:-1}
    ]
    return points.map(p => {
      return {
        lat: co.lat + (p.x/data.variation),
        lng: co.lng + (p.y/data.variation)
      }
    })
  }

  const flightPath = new google.maps.Polyline({
    path: getSquare(data.target),
    geodesic: true,
    strokeColor: "#FF0000",
    strokeOpacity: 1.0,
    strokeWeight: 2,
    map
  });
  const marker = new google.maps.Marker({
    position: data.target, map
  });

  // Configure the click listener.
  map.addListener("click", mevent => {
    let coords = mevent.latLng.toJSON();
    setTarget(coords)
    flightPath.setPath(getSquare(coords))
  })
  
  
  const watchId = navigator.geolocation.watchPosition(position => {
    const { latitude, longitude } = position.coords;
    let coords = {lat: latitude, lng: longitude };
    marker?.setPosition(new google.maps.LatLng(latitude, longitude))
    setCurrent(coords);
  });
}
