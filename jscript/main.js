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
	document.getElementById('ResultatLivre').style.display = 'block';
	document.getElementById('ResultatLivre').style.visibility = 'visible';
	//document.getElementById('pochListe').style.visibility = 'hidden';
	
	let titre = document.myForm.titre.value;
	let auteur = document.myForm.auteur.value;
	if (titre==null || titre.length<1) {
			if (auteur==null || auteur.length<1) {
				alert("Vous devez choisir des critères de recherche.");
				return;
			} else {
				auteur = "inauthor:"+auteur;
			}
	} else {
		titre = "intitle:"+titre;
	}

	let url = "https://www.googleapis.com/books/v1/volumes?key=AIzaSyBFjzEAVJEbpTF1Ee-eNv3Jy1m2s4BbtKU&q=" + titre + "+" + auteur;
	httpGetAsync(url, handleResponse);


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

function handleResponse(response) {
	document.querySelector('.content').innerHTML = "";

	const h2Resultat = document.createElement('h2');
	h2Resultat.className="h2";
		console.log("Résultats de ma recherche");
	h2Resultat.innerText="Résultats de ma recherche :";
	document.querySelector('.content').appendChild(h2Resultat);

	for (var i = 0; i < response.items.length; i++) {
		let item = response.items[i];
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
		boutonElement.className = "fa-solid fa-book-bookmark fa-xl";
		
		//j'ajoute au bouton la fonction javascript 'methodeBoutonAjoutListe' qui prend en parametre l'item en cours
		boutonElement.onclick = function() { methodeBoutonAjoutListe(item); };
		divElement.appendChild(boutonElement);
		document.querySelector('.content').appendChild(divElement);

	}

}

function annulerRecherche() { //revient à la page d'accueil
	document.getElementById('NouveauLivre').style.display = 'none';
	document.getElementById('NouveauLivre').style.visibility = 'hidden';
	document.getElementById('myBooks').style.visibility = 'visible';
	document.getElementById('myBooks').style.display = 'block';
	document.getElementById('pochListe').style.visibility = 'visible';
	document.getElementById('ResultatLivre').style.visibility = 'hidden';
	document.getElementById('ResultatLivre').style.display = 'none';

}

function methodeBoutonAjoutListe(item) {
	console.log(item.id);
	
	if(window.localStorage.getItem(item.id)!= null){
		
		alert('Le livre existe dans la PochListe');
		
	}	
	window.sessionStorage.setItem(item.id, JSON.stringify(item));
	window.localStorage.setItem(item.id, JSON.stringify(item));
			
	chargementPochListe();
	
}

function methodeSuppressionListe(item) {
	console.log(item.id);
	
	window.sessionStorage.removeItem(item.id);
	window.localStorage.removeItem(item.id);
	
	chargementPochListe();
	
}

function methodeEffacerListe() {  // purge toute la liste
	document.getElementById('pochListe').innerHTML = "";
		for (let i=0; i<window.localStorage.length; i++) {
			 let key = window.localStorage.key(i);
			 window.localStorage.removeItem(key);
			 window.sessionStorage.removeItem(key);
		  }

	headerPochList();
}

function chargementPochListe() { //purge la liste et reconstruit le header et le contenu de la liste
		document.getElementById('pochListe').innerHTML = "";
		headerPochList();
		
			for (let i=0; i<window.localStorage.length; i++) {
	 			 let key = window.localStorage.key(i);
	 			 
				 let item = JSON.parse(window.localStorage.getItem(key));
							
				 let fullDescription = "";
				 try {
					if(typeof item.volumeInfo.description !="undefined"){
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
				divElement.className = "boxPochList";				
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
								
				const boutonElementTrash = document.createElement('i');
				boutonElementTrash.className = "fa-solid fa-trash fa-xl";	
		
				boutonElementTrash.onclick = function() { methodeSuppressionListe(item); };
				divElement.appendChild(boutonElementTrash);
				document.getElementById('pochListe').appendChild(divElement);		  
						  
			}
}

function headerPochList() { // construit le header de la liste vide (titre + bouton purger)
		const h2PochList = document.createElement('h2');
		h2PochList.className="h2";
		h2PochList.innerText="Ma poch'liste";
		const divElementPochList = document.createElement('div');
		const boutonClearElement = document.createElement('i');
		boutonClearElement.className = "fa-solid fa-trash";
		boutonClearElement.innerText = " Effacer TOUTE ma Poch liste";
		boutonClearElement.onclick = function() { methodeEffacerListe(); };
		divElementPochList.appendChild(boutonClearElement);
		document.getElementById('pochListe').appendChild(h2PochList);
		document.getElementById('pochListe').appendChild(divElementPochList);
}









