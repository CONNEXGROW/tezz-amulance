// Firebase initialization
const firebaseConfig = {
    apiKey: "AIzaSyAoNCJkX8-s-TSUugTEs-lMjniJMmEsXNo",
    authDomain: "connexgrowshop.firebaseapp.com",
    projectId: "connexgrowshop",
    storageBucket: "connexgrowshop.appspot.com",
    messagingSenderId: "1008199358399",
    appId: "1:1008199358399:web:597552cb5f68c3b75d330a"
  };
  
  // Initialize Firebase
  const app = firebase.initializeApp(firebaseConfig);
  const db = firebase.database();
  
  // Initialize the map and autocomplete fields
  function initAutocomplete() {
    const currentLocationInput = document.getElementById('currentLocation');
    const destinationLocationInput = document.getElementById('destinationLocation');
  
    // Initialize Google Places Autocomplete
    const autocompleteCurrent = new google.maps.places.Autocomplete(currentLocationInput);
    const autocompleteDestination = new google.maps.places.Autocomplete(destinationLocationInput);
  
    // Geolocation API to get the current location automatically
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        const lat = position.coords.latitude;
        const lng = position.coords.longitude;
  
        const geocoder = new google.maps.Geocoder();
        const latlng = { lat, lng };
        geocoder.geocode({ location: latlng }, (results, status) => {
          if (status === 'OK' && results[0]) {
            currentLocationInput.value = results[0].formatted_address;
          } else {
            alert('Failed to detect your location');
          }
        });
      });
    }
  }
  
  // Function to calculate distance using Google Maps API
  function calculateDistance() {
    const currentLocation = document.getElementById('currentLocation').value;
    const destinationLocation = document.getElementById('destinationLocation').value;
  
    if (currentLocation && destinationLocation) {
      const service = new google.maps.DistanceMatrixService();
      service.getDistanceMatrix({
        origins: [currentLocation],
        destinations: [destinationLocation],
        travelMode: 'DRIVING',
      }, function (response, status) {
        if (status === 'OK') {
          const distanceText = response.rows[0].elements[0].distance.text;
          document.getElementById('distance').value = distanceText;
        } else {
          alert('Error calculating distance. Please try again.');
        }
      });
    } else {
      alert('Please enter both locations.');
    }
  }
  
  // Function to book ambulance and dial the number
  function bookAmbulance() {
    const name = document.getElementById('name').value;
    const currentLocation = document.getElementById('currentLocation').value;
    const destinationLocation = document.getElementById('destinationLocation').value;
    const distance = document.getElementById('distance').value;
  
    if (name && currentLocation && destinationLocation && distance) {
      // Store booking details in Firebase
      const bookingData = {
        name: name,
        currentLocation: currentLocation,
        destinationLocation: destinationLocation,
        distance: distance
      };
  
      db.ref('bookings').push(bookingData, (error) => {
        if (error) {
          document.getElementById('status').innerText = "Booking failed. Please try again.";
        } else {
          document.getElementById('status').innerText = "Ambulance booked successfully! Dialing...";
  
          // Automatically open the dialer with the ambulance number (e.g., 102)
          window.location.href = 'tel:+919471314033';
        }
      });
    } else {
      alert('Please complete all fields and calculate the distance.');
    }
  }
  
  // Initialize autocomplete when the page loads
  window.onload = initAutocomplete;
  