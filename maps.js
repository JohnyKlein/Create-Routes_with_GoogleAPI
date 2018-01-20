var partida = document.getElementById('partida');
var destino = document.getElementById('destino');
var armazenaParadas = [];
var contador = 0, contaClick = 0, contaSubmitRota = 0, contDirecoes = 0;
var listaWaypoints = document.getElementById("listaWaypoints");
var directionsService;
var directionsDisplay, summaryPanel = document.getElementById('directions-panel');

function armazenarParadas(){
   var parada = document.getElementById("parada").value;

  if(parada===""){
      alert("Não insira uma parada vazia!")
  } else {
   armazenaParadas.push(parada);
   alert("Parada inserida com sucesso!");
   document.getElementById("parada").value = "";         
  }

}

function inserirParadasHtml(){
    contaClick++;    
     if (contaClick==1){
      listaWaypoints.innerHTML += "<div class='linha-titles'>" + "<h3><b>Paradas:</b></h3></div>";
     }
    for(var i=contador; i<armazenaParadas.length; i++){
       listaWaypoints.innerHTML +=  "<label class='waypoints'>" + (i+1) + " - " +
                                               armazenaParadas[i] +
                                     "</label>" + 
                                      "<br/>";
       contador++;
    }      
}

function zerarParadas(){  
    armazenaParadas = [];
    listaWaypoints.innerHTML = "";
    contador = 0, contaClick = 0;
    alert("Todas as paradas foram removidas!")
}

function zerarRotas(){
  partida.value = "";
  destino.value = "";
      
  directionsDisplay.setPanel(null); //Zera direções
  directionsDisplay.setMap(null); //Zera Mapa
  initMap(); //Config novamente Mapa
  zerarParadas();  
  summaryPanel.innerHTML = "";
  contaSubmitRota = 0;  
  contDirecoes = 0;    
}


function initMap() {
  document.getElementById("parada").value = "";
  directionsService = new google.maps.DirectionsService;
  directionsDisplay = new google.maps.DirectionsRenderer;
  var map = new google.maps.Map(document.getElementById('map'), {
    zoom: 5,
    center: {lat: -14.23, lng: -51.92}
  });

  directionsDisplay.setMap(map);
  new AutocompleteDirectionsHandler(map);
    
document.getElementById('returnRota').addEventListener('click', function(){
  inserirParadasHtml();    
  if(contaSubmitRota!=0){
      directionsDisplay.setPanel(null);
  }     
  contaSubmitRota++;
});    
       
  document.getElementById('returnRota').addEventListener('click', function() {
    calculateAndDisplayRoute(directionsService, directionsDisplay);
  });
}

//Auto Complete Inputs
function AutocompleteDirectionsHandler(map) {
  this.map = map;
  this.originPlaceId = null;
  this.destinationPlaceId = null;    
  var modeSelector = document.getElementById('mode-selector');
  var originInput = partida;
  var destinationInput = destino;
  var stopsInput = document.getElementById('parada');
  var originAutocomplete = new google.maps.places.Autocomplete(
      originInput, {placeIdOnly: true});
  var destinationAutocomplete = new google.maps.places.Autocomplete(
      destinationInput, {placeIdOnly: true});
  var destinationAutocomplete = new google.maps.places.Autocomplete(
      stopsInput, {placeIdOnly: true});     

  //this.map.controls[google.maps.ControlPosition.TOP_LEFT].push(modeSelector);
}

//Paradas
function calculateAndDisplayRoute(directionsService, directionsDisplay) { 
  var waypts = [];
  var labelBoxArray = document.getElementsByClassName("waypoints");
  var checkboxArray = document.getElementsByClassName("boxWaypoints");    

  for (var i = 0; i < labelBoxArray.length; i++) {
    var teste = labelBoxArray[i];          
      waypts.push({
        location: labelBoxArray[i].textContent,
        stopover: true
      });
  }

  //Definições Finais da Rota
  directionsService.route({
    travelMode: travelSelecionada(),
    origin: partida.value,
    destination: destino.value,
    waypoints: waypts,
    optimizeWaypoints: true,

  }, function(response, status) {
    if (status === 'OK') {
      directionsDisplay.setDirections(response);
      var route = response.routes[0]; //Traz propriedades da rota
      
      if (contDirecoes===0){
          summaryPanel.innerHTML += "<div class='linha-titles'>" +
                                       "<h3><b>Direções:</b></h3></div>"; 
      }    
      contDirecoes++;    
        
      directionsDisplay.setPanel(summaryPanel); //Traz as direçoes

    } else {
      window.alert('Erro ao traçar rota: ' + status);
    }
  });
}

function travelSelecionada(){
  var caminhando = $("#changemode-walking").is(":checked")
  var dirigindo = $("#changemode-driving").is(":checked")
  var transito = $("#changemode-transit").is(":checked")

    if (caminhando){return 'WALKING'};
    if (dirigindo){return 'DRIVING'};
    if (transito){return 'TRANSIT'};      
}