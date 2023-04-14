/**
 * 
 */
 function affichagePage2()
 {
	 	document.getElementById('NouveauLivre').style.display='block';
		document.getElementById('NouveauLivre').style.visibility='visible';
		document.getElementById('myBooks').style.visibility='hidden';
		document.getElementById('myBooks').style.display='none';
		document.getElementById('pochListe').style.visibility='visible';
 }
 
  function affichageResultat1()
 {
		document.getElementById('ResultatLivre').style.visibility='visible';
		document.getElementById('pochListe').style.visibility='hidden';
 }
 
   function annulerRecherche()
 {
	 	document.getElementById('NouveauLivre').style.display='none';
		document.getElementById('NouveauLivre').style.visibility='hidden';
		document.getElementById('myBooks').style.visibility='visible';
		document.getElementById('myBooks').style.display='block';
		document.getElementById('pochListe').style.visibility='visible';
		document.getElementById('ResultatLivre').style.visibility='hidden';
 }