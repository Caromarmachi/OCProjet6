/**
 * 
 */

function affichagePage2() {
	document.getElementById('divFormulaire').style.display = 'block';
	document.getElementById('divFormulaire').style.visibility = 'visible';
	document.getElementById('monBoutonAjouterLivre').style.visibility = 'hidden';
	document.getElementById('monBoutonAjouterLivre').style.display = 'none';
}

function affichageResultat1() {
	document.getElementById('divResultatLivre').style.display = 'grid';
	document.getElementById('divResultatLivre').style.visibility = 'visible';

	
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
	if (response.items == null) {
		alert("Aucun livre n'a été trouvé");
	} else {	
	
		let divResultatLivre = document.getElementById('divResultatLivre');
		divResultatLivre.innerHTML = "";
		let divMyBooks = document.getElementById('myBooks');
		let h2Resultat = document.getElementById('h2Resultat');
	
		if(h2Resultat===null) {
			h2Resultat = document.createElement('h2');
			h2Resultat.className="h2";
			h2Resultat.id="h2Resultat";
			h2Resultat.innerText="Résultats de ma recherche :";
			h2Resultat =  divMyBooks.insertBefore(h2Resultat,divResultatLivre);
		}
		
		document.getElementById('h2Resultat').style.visibility = 'visible';
		document.getElementById('h2Resultat').style.display = 'block';


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
	
			let divElement = document.createElement('div');
			divElement.className = "box";		
			let ulElement = document.createElement('ul');
			ulElement.className = "ulBookClass";
			let titreElement = document.createElement('li');
			titreElement.innerHTML = "<b>Titre: " + item.volumeInfo.title + "</b>";
			let idElement = document.createElement('li');
			idElement.innerHTML = "<b>ID: " + item.id + "</b>";
			let auteursElement = document.createElement('li');
			auteursElement.innerText = "Auteurs: " + item.volumeInfo.authors;
			let descriptionElement = document.createElement('li');
			descriptionElement.innerText = "Description: " + fullDescription + "...";
			let imageElement = document.createElement('img');
			imageElement.src = image;
			imageElement.className = "imagesBook";
	
			divElement.appendChild(ulElement);
			ulElement.appendChild(titreElement)
			ulElement.appendChild(idElement)
			ulElement.appendChild(auteursElement)
			ulElement.appendChild(descriptionElement)
			divElement.appendChild(imageElement);
	
			let boutonElement = document.createElement('i');
			boutonElement.className = "fa-solid fa-book-bookmark fa-xl iconAjout";
			
		
	//I add to the button the javascript function 'MethodBoutonAjoutListe' which takes the current item as a parameter
			boutonElement.onclick = function() { methodeBoutonAjoutListe(item); };
			divElement.prepend(boutonElement);
			divResultatLivre.appendChild(divElement);
	
		}
	}

}

function annulerRecherche() { 
//return to home page
	document.getElementById('divFormulaire').style.display = 'none';
	document.getElementById('divFormulaire').style.visibility = 'hidden';
	document.getElementById('monBoutonAjouterLivre').style.visibility = 'visible';
	document.getElementById('monBoutonAjouterLivre').style.display = 'block';	

	document.getElementById('divResultatLivre').style.visibility = 'hidden';
	document.getElementById('divResultatLivre').style.display = 'none';
	document.getElementById('h2Resultat').style.visibility = 'hidden';
	document.getElementById('h2Resultat').style.display = 'none';
	
	
	document.getElementById('content').style.visibility = 'visible';
	document.getElementById('content').style.display = 'grid';

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
	window.sessionStorage.removeItem(item.id);
	window.localStorage.removeItem(item.id);
	
	chargementPochListe();
	
}

function methodeEffacerListe() { // purge the whole list
	document.getElementById('content').innerHTML = "";
		for (let i=0; i<window.localStorage.length; i++) {
			 let key = window.localStorage.key(i);
			 window.localStorage.removeItem(key);
			 window.sessionStorage.removeItem(key);
		  }

	headerPochList();
}
// purge the list and rebuild the header and the content of the list
function chargementPochListe() { 
		document.getElementById('content').innerHTML = "";
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
		
				let divElement = document.createElement('div');
				divElement.className = "box boxPochList";				
				let ulElement = document.createElement('ul');
				ulElement.className = "ulBookClass";		
				let titreElement = document.createElement('li');
				titreElement.innerHTML = "<b>Titre: " + item.volumeInfo.title + "</b>";		
				let idElement = document.createElement('li');
				idElement.innerHTML = "<b>ID: " + item.id + "</b>";	
				let auteursElement = document.createElement('li');
				auteursElement.innerText = "Auteurs: " + item.volumeInfo.authors;		
				let descriptionElement = document.createElement('li');
				descriptionElement.innerText = "Description: " + fullDescription + "...";		
				let imageElement = document.createElement('img');
				imageElement.src = image;
				imageElement.className = "imagesBook";
				
				divElement.appendChild(ulElement);
				ulElement.appendChild(titreElement)
				ulElement.appendChild(idElement)
				ulElement.appendChild(auteursElement)
				ulElement.appendChild(descriptionElement)
				divElement.appendChild(imageElement);
								
				let boutonElementTrash = document.createElement('i');
				boutonElementTrash.className = "fa-solid fa-trash fa-xl iconAjout";	
		
				boutonElementTrash.onclick = function() { methodeSuppressionListe(item); };
				divElement.prepend(boutonElementTrash);
				document.getElementById('content').appendChild(divElement);		

						  
			}
}
// build the header of the empty list (title + purge button)
function headerPochList() { 
	
		let divContent = document.getElementById('content');
		let h2PochList = document.getElementById('h2PochList');
		let divMyBooks = document.getElementById('myBooks');

	
		if(h2PochList===null) {
			h2PochList = document.createElement('h2');
			h2PochList.className="h2";
			h2PochList.id="h2PochList";
			h2PochList.innerText="Ma poch'liste";
			h2PochList =  divMyBooks.insertBefore(h2PochList,divContent);
		}
		
		document.getElementById('content').style.visibility = 'visible';
		document.getElementById('content').style.display = 'grid';
	
		
}

function initPage() {
	let monBoutonAjouterLivre = document.createElement('button');
	monBoutonAjouterLivre.className = "btn";	
	monBoutonAjouterLivre.innerText = 'Ajouter un livre';
	monBoutonAjouterLivre.id = "monBoutonAjouterLivre";
	monBoutonAjouterLivre.onclick = function() { affichagePage2(); };
	let divMyBooks = document.getElementById('myBooks');
	let myHR = document.getElementsByTagName('hr')[0];
	monBoutonAjouterLivre = divMyBooks.insertBefore(monBoutonAjouterLivre,myHR);
	let  divFormulaire = document.createElement('div');
	divFormulaire.id = "divFormulaire";
	let innerHTMLForm = "<form  name=\"myForm\"> " +
				"<p>" +
    			"<label for=\"titre du live\">Titre du livre :</label><br>" +
 			 	"<input type=\"text\" name=\"titre\" id=\"titre\" placeholder=\"Ex. : Le Tunnel\" size=\"20\" maxlength=\"20\"><br>" +
 			 	"<label for=\"auteur\">Auteur :</label><br>" +
 			 	"<input type=\"text\" name=\"auteur\" id=\"auteur\" placeholder=\"Ex. : Ernesto Sabato\" size=\"20\" maxlength=\"20\"><br>" +
 				"<input type=\"button\" class=\"btn\"  onclick=\"affichageResultat1();\" value=\"Rechercher\">" +
 				"<input type=\"button\" class=\"btn btn-rouge\"  onclick=\"annulerRecherche();\" value=\"Annuler\">" +
 				"</p>" +
 			"</form>";
	divFormulaire.innerHTML = innerHTMLForm;	
	divFormulaire =  divMyBooks.insertBefore(divFormulaire,myHR);
	let  divResultatLivre = document.createElement('div');
	divResultatLivre.id = "divResultatLivre";
	divResultatLivre =  divMyBooks.insertBefore(divResultatLivre,myHR);

	
	chargementPochListe();	
	

}

initPage();





