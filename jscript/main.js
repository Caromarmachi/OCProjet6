/**
 * 
 */

function affichagePage2() {
	document.getElementById('NouveauLivre').style.display = 'block';
	document.getElementById('NouveauLivre').style.visibility = 'visible';
	document.getElementById('myBooks').style.visibility = 'hidden';
	document.getElementById('myBooks').style.display = 'none';
	document.getElementById('pochListe').style.visibility = 'visible';
}

function affichageResultat1() {
	document.getElementById('ResultatLivre').style.visibility = 'visible';
	//document.getElementById('pochListe').style.visibility = 'hidden';
	let titre = document.myForm.titre.value;
	let url = "https://www.googleapis.com/books/v1/volumes?key=AIzaSyBFjzEAVJEbpTF1Ee-eNv3Jy1m2s4BbtKU&q=" + titre;
	httpGetAsync(url, handleResponse);
}


function handleResponse(response) {
	document.querySelector('.content').innerHTML = "";
	
	const h2Resultat = document.createElement('h2');
	h2Resultat.className="h2";
	h2Resultat.innerText="Résultats de ma recherche :";
	document.querySelector('.content').appendChild(h2Resultat);

	for (var i = 0; i < response.items.length; i++) {
		var item = response.items[i];
		// in production code, item.text should have the HTML entities escaped.
		let fullDescription = "";
		try {
			if(typeof item.volumeInfo.description !="undefined"){
			//	console.log(item.volumeInfo.description);
	
				fullDescription = item.volumeInfo.description + '';
				if (fullDescription.length > 199) {
					fullDescription = fullDescription.substring(0, 199);
										
				}
			}
			else {fullDescription = "Pas de description";
			}
		} catch (error) {

			fullDescription = "Pas de description";

		}

		let image = "";
		try {
			image = item.volumeInfo.imageLinks.smallThumbnail;
		} catch (error) {
			image = "images/unavailable.png";
		}


		
		const divElement = document.createElement('div');
		divElement.className = "box";
		
		

		const ulElement = document.createElement('ul');
		ulElement.className = "ulBookClass";

		const titreElement = document.createElement('li');
		titreElement.innerText = "Titre: " + item.volumeInfo.title;

		const idElement = document.createElement('li');
		idElement.innerText = "ID: " + item.id;

		const auteursElement = document.createElement('li');
		auteursElement.innerText = "Auteurs: " + item.volumeInfo.authors;

		const descriptionElement = document.createElement('li');
		descriptionElement.innerText = "Description: " + fullDescription + "...";

		const imageElement = document.createElement('img');
		imageElement.src = image;
		imageElement.className = "imagesBook";


		divElement.appendChild(ulElement);
		ulElement.appendChild(titreElement)
		ulElement.appendChild(idElement)
		ulElement.appendChild(auteursElement)
		ulElement.appendChild(descriptionElement)
		divElement.appendChild(imageElement);
		
		
		const boutonElement = document.createElement('i');
		boutonElement.className = "fa-solid fa-book-bookmark";
		//je sauvegarde le contenu du div dans une variable 'elementRecherche'
		let elementRecherche = divElement.innerHTML;

		//j'ajoute au bouton la fonction javascript 'methodeBoutonAjoutListe' qui prend en parametre la variable elementRecherche
		boutonElement.onclick = function() { methodeBoutonAjoutListe(elementRecherche); };
		divElement.appendChild(boutonElement);
		document.querySelector('.content').appendChild(divElement);

	}

}


function methodeBoutonAjoutListe(elementRecherche) {

	//recupere le contenu sauvegardé en session
	let contenuDeMaPochListeEnSession = window.sessionStorage.getItem("maPochListe");
	if (contenuDeMaPochListeEnSession===null) {
		contenuDeMaPochListeEnSession = "";
	}
	//ajoute l'elementRecherche dans le contenu sauvegardé en session
	window.sessionStorage.setItem("maPochListe", contenuDeMaPochListeEnSession + elementRecherche);
	window.localStorage.setItem("maPochListe", contenuDeMaPochListeEnSession + elementRecherche);

	chargementPochListe();
	
}

function chargementPochListe() { //purge la liste et reconstruit le header et le contenu de la liste
		document.getElementById('pochListe').innerHTML = "";
		headerPochList();
		const divElementACharger = document.createElement('div');
		
		let contenuDeMaPochListe = window.localStorage.getItem("maPochListe");
		if (contenuDeMaPochListe!==null && contenuDeMaPochListe.length>10) {
			divElementACharger.innerHTML = contenuDeMaPochListe;
			window.sessionStorage.setItem("maPochListe", contenuDeMaPochListe);
		}
			
		document.getElementById('pochListe').appendChild(divElementACharger);
}

function headerPochList() { // construit le header de la liste vide (titre + bouton purger)
		const h2PochList = document.createElement('h2');
		h2PochList.className="h2";
		h2PochList.innerText="Ma poch'liste";
		const divElementPochList = document.createElement('div');
		const boutonClearElement = document.createElement('i');
		boutonClearElement.className = "fa-solid fa-trash";
		boutonClearElement.innerText = " Effacer ma Poch liste"
		boutonClearElement.onclick = function() { methodeEffacerListe(); };
		divElementPochList.appendChild(boutonClearElement);
		document.getElementById('pochListe').appendChild(h2PochList);
		document.getElementById('pochListe').appendChild(divElementPochList);
}

function methodeEffacerListe() {  // purge toute la liste
	document.getElementById('pochListe').innerHTML = "";
	window.localStorage.clear("maPochListe");
	window.sessionStorage.clear("maPochListe");
	headerPochList();
}

function annulerRecherche() { //revient à la page d'accueil
	document.getElementById('NouveauLivre').style.display = 'none';
	document.getElementById('NouveauLivre').style.visibility = 'hidden';
	document.getElementById('myBooks').style.visibility = 'visible';
	document.getElementById('myBooks').style.display = 'block';
	document.getElementById('pochListe').style.visibility = 'visible';
	document.getElementById('ResultatLivre').style.visibility = 'hidden';
}

async function fetchAsync(url) {  //pas utilisé ici
	let response = await fetch(url);
	let data = await response.json();
	return data;
}

function testFetch(url) {  //pas utilisé ici
	fetch(url)
		.then(function(response) {
			return response.json();
		})
		.then(function(jsonResponse) {
			// do something with jsonResponse
		});

}

function httpGetAsync(theUrl, callback) {
	var xmlHttp = new XMLHttpRequest();
	xmlHttp.onreadystatechange = function() {
		if (xmlHttp.readyState == 4 && xmlHttp.status == 200)
			callback(xmlHttp.response);
	}
	xmlHttp.open("GET", theUrl, true); // true for asynchronous 
	xmlHttp.responseType = 'json';
	xmlHttp.send(null);
}



