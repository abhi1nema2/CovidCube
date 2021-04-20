class CovidCube {
  constructor() {
    this.covidData = {
      confirmed: 0,
      deceased: 0,
      recovered: 0,
      vaccinated: 0
    };
    this.city = document.querySelector('.city');
    this.confirmed = document.querySelector('#confirmed');
    this.deceased = document.querySelector('#deceased');
    this.recovered = document.querySelector('#recovered');
    this.vaccinated = document.querySelector('#vaccinated');
    this.cube = document.querySelector('.cube');
    this.radioGroup = document.querySelector('.radio-group');
    this.phoneNumber = document.querySelector('#phone-number');
    this.currentClass = '';
  }

  successfulLookup = async (position) => {
    const { latitude, longitude } = position.coords;
    const fetchCity = await fetch(`https://api.opencagedata.com/geocode/v1/json?q=${latitude}+${longitude}&key=d7babad2b3a34aa99583ca4f6673c4f6`)
    const fetchCityRes = await fetchCity.json();
    const city = fetchCityRes.results[0].components.city;
    const stateCode = fetchCityRes.results[0].components.state_code;
    const state = fetchCityRes.results[0].components.state;
    this.city.innerHTML = `Your Location: ${city}`;

    const covidDataFetch = await fetch(`https://api.covid19india.org/v4/min/data.min.json`)
    const covidDataRes = await covidDataFetch.json();
    const cityData = await covidDataRes;
    this.covidData = await cityData[stateCode].districts[city].delta7;
    //PAGE 1
    this.confirmed.querySelector('.count').innerHTML = this.covidData.confirmed;
    this.deceased.querySelector('.count').innerHTML = this.covidData.deceased;
    this.recovered.querySelector('.count').innerHTML = this.covidData.recovered;
    //PAGE 2
    this.vaccinated.querySelector('.count').innerHTML = this.covidData.vaccinated;

    //PAGE3
    const covidHelpLine = await fetch(`https://api.rootnet.in/covid19-in/contacts`)
    const covidHelpLineRes = await covidHelpLine.json();
    const helpline = await covidHelpLineRes;
    const stateNumber = helpline.data.contacts.regional.find((item) => item.loc.toLowerCase() === state.toLowerCase());
    this.phoneNumber.href = `tel: ${stateNumber.number}`;
    this.phoneNumber.innerHTML = stateNumber.number;
  }

  changeSide = () => {
    const checkedRadio = this.radioGroup.querySelector(':checked');
    const showClass = 'show-' + checkedRadio.value;
    if ( this.currentClass ) {
      this.cube.classList.remove( this.currentClass );
    }
    this.cube.classList.add( showClass );
    this.currentClass = showClass;
  }

  init() {
    if (window.navigator.geolocation) {
      // Geolocation available
      window.navigator.geolocation.getCurrentPosition(this.successfulLookup, console.log);
    }

    // Setting listerners for radio Buttons
    this.changeSide();
    this.radioGroup.addEventListener( 'change', this.changeSide );
  }
}

const covid = new CovidCube();
covid.init();

document.addEventListener('DOMContentLoaded', (event) => {
  var dragSrcEl = null;

  function handleDragStart(e) {
    dragSrcEl = this;

    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/html', this.innerHTML);
  }

  function handleDragOver(e) {
    if (e.preventDefault) {
      e.preventDefault();
    }

    e.dataTransfer.dropEffect = 'move';
    return false;
  }

  function handleDrop(e) {
    if (e.stopPropagation) {
      e.stopPropagation(); // stops the browser from redirecting.
    }
    
    if (dragSrcEl != this) {
      dragSrcEl.innerHTML = this.innerHTML;
      this.innerHTML = e.dataTransfer.getData('text/html');
    }
    
    return false;
  }


  let items = document.querySelectorAll('.cube .box');
  items.forEach(function(item) {
    item.addEventListener('dragstart', handleDragStart, false);
    item.addEventListener('dragover', handleDragOver, false);
    item.addEventListener('drop', handleDrop, false);
  });
});