export default function cookieBannerHelper() {

	good_matches = []
	bad_matches = []

	good_sentences = ["CONTINUER SANS ACCEPTER", "TOUT REFUSER", "REJETER", "REFUSER", "REFUSER LES COOKIES", "JE REFUSE"]
	bad_sentences = ["ACCEPTER ET CONTINUER", "TOUT ACCEPTER", "ACCEPTER LES COOKIES", "ACCEPTER","J'ACCEPTE","TOUT AUTORISER"]

	max_length = 0

	good_sentences.forEach((sentence) => {
		if(sentence.length > max_length){
			max_length = sentence.length
		}
	})
	bad_sentences.forEach((sentence) => {
		if(sentence.length > max_length){
			max_length = sentence.length
		}	
	})

	var elems = document.getElementsByTagName("*");

	for(let i=0 ; i<elems.length ; i++){
		let elem = elems[i]

		if (elem && elem.innerText){
			good_sentences.forEach((sentence) => {
				if(elem.innerText.toUpperCase().includes(sentence) && elem.innerText.length < max_length * 1.5){
					let found = false;
					for(let i=0 ; i<elem.childNodes.length ; i++){
						let childNode = elem.childNodes[i]
						if (childNode && childNode.innerText && childNode.innerText.includes(sentence)) {
							found = true
							break
						}
					}
					if(!found){
						console.log("not found")
						console.log(elem)
		    			good_matches.push(elem);
		    			if(elem.parentNode.tagName === 'BUTTON'){
		    				console.log("parent button")
		    				console.log(elem.parentNode)
		    				console.log(elem.parentNode.tagName)
		    				good_matches.push(elem.parentNode)
		    			}
		    		}
				}
			})
			bad_sentences.forEach((sentence) => {
				if(elem.innerText.toUpperCase().includes(sentence) && elem.innerText.length < max_length * 1.5){
					let found = false;
					for(let i=0 ; i<elem.childNodes.length ; i++){
						let childNode = elem.childNodes[i]
						if (childNode && childNode.innerText && childNode.innerText.includes(sentence)) {
							found = true
							break
						}
					}
					if(!found){
		    			bad_matches.push(elem);
		    			if(elem.parentNode.tagName == 'BUTTON'){
		    				bad_matches.push(elem.parentNode)
		    			}
		    		}
				}
			})
		}
	}
	
	
	bad_matches.forEach((el) => {
		el.style.setProperty('color', 'white', 'important');
		el.style.setProperty('background-color', 'red', 'important');
		el.style.setProperty('font-weight','bold','important');
	})
	good_matches.forEach((el) => {
		el.style.setProperty('color', 'white', 'important');
		el.style.setProperty('background-color', 'green', 'important');
		el.style.setProperty('font-weight','bold','important');
	})
}

