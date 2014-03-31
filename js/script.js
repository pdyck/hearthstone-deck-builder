/*
 * Hearthstone script
 * by Philipp Dyck
 * created on 20.12.2013
 *
 * continue line 116
 * 
 */

// Variables

var cards, meta, search, results = new Array(), deck = new Array();
var collection = {
	warrior: [],
	hunter: [],
	shaman: [],
	mage: [],
	druid: [],
	paladin: [],
	priest: [],
	warlock: [],
	rogue: [],
	neutral: []
};
var options = {
	search: "",
	class: "druid",
	page: 1
};

var keywords = {
	rarities: [
		"free",
		"common",
		"rare",
		"epic",
		"legendary"
	],
	effects: [
		"battlecry",
		"charge",
		"combo",
		"deathrattle",
		"divine_shield",
		"divine shield",
		"enrage",
		"overload",
		"secret",
		"spell_damage",
		"spell damage",
		"stealth",
		"taunt",
		"windfury"
	]
};

$.ajax({
	url: "json/cards.json",
	success: function (data) {
		meta = data.meta;
		cards = data.cards.sort(function(a,b) { return parseFloat(a.mana) - parseFloat(b.mana) } );
		importDeckByUrl();

		$.each(cards, function (i, v) {
			if (v.collectible && v.type != "hero" && v.type != "ability") {
				collection[v.class].push(v);
			}
		});

		load(options);
	}
});

// Standard functions

String.prototype.fuzzy = function (s) {
    var hay = this.toLowerCase(), i = 0, n = 0, l;
    s = s.toLowerCase();
    for (; l = s[i++] ;) if ((n = hay.indexOf(l, n)) === -1) return false;
    return true;
};

String.prototype.search = function (s) {
	var hay = this.toLowerCase();
	s = s.toLowerCase();
	if (hay.indexOf(s) === -1) return false;
	return true;
}

Array.prototype.has = function (s) {
	for (i in this) if (this[i] == s) return true;
	return false;
};

Array.prototype.hasHowMuch = function (s) {
	var a = 0;
	if (this.length == 0)
		return 0;
	else
		for (i in this) if (this[i].id == s) a++;
	return a;
}

// Functions

function load () {
	results = new Array();
	
	if (keywords.rarities.has(options.search)) {
		$.each(collection[options.class], function (i, v) {
			if (v.quality == options.search) results.push(v);
		});
	} else if (keywords.effects.has(options.search)) {
		$.each(collection[options.class], function (i, v) {
			if (v.effect_list.length > 0) {
				for (x in v.effect_list) if (v.effect_list[x].effect == options.search) results.push(v);
			}
		});
	} else {
		$.each(collection[options.class], function (i, v) {
			if (v.name.search(options.search)) results.push(v);
		});
	}

	display();
}

function display () {
	$("#results").html("");
	$("#results").append("<h2 class=\"class-name\">" + options.class + "</h2>")
	$.each(results, function (i, v) {
		if (i >= (options.page - 1) * 8  && i <= options.page * 8 - 1)
			$("#results").append("<img src=\"" + v.image + "\" class=\"card\" alt=\"" + v.name + "\" data-id=\"" + v.id + "\" width=\"150\" height=\"227\" />");
	});
}

function getCardById (id) {
	for (i in cards) if (cards[i].id == id) return cards[i];
	return null;
}

function getCardByName (name) {
	for (i in cards) if (cards[i].name == name) return cards[i];
	return null;
}

function showDeck () {
	$("#deck").html("");
	$("#deck-size").html("Deck: " + deck.length + "/30");
	
	var arr = [];
	for (i in deck) arr.push(deck[i].id);
	var counts = {};
	for (var i = 0; i < arr.length; i++) {
		counts[arr[i]] = 1 + (counts[arr[i]] || 0);
	}

	var unique = [];
	$.each(deck, function (i, v) {
		if ($.inArray(v, unique) === -1) unique.push(v);
	})


	$.each(unique, function (i, v) {
		if (counts[v.id] == 2)
			$("#deck").append("<li class=\"deck-entry\" data-count=\"c2\" data-mana=\"m" + v.mana + "\" data-id=\"" + v.id + "\">" + v.name + "</li>");
		else
			$("#deck").append("<li class=\"deck-entry\" data-count=\"c1\" data-mana=\"m" + v.mana + "\" data-id=\"" + v.id + "\">" + v.name + "</li>");
	});
}

function clearDeck () {
	deck = [];
	showDeck();
}

function exportDeck () {
	var exported = [];
	$.each(deck, function (i, v) {
		exported.push(v.id);
	});
	exported = "http://pdyck.github.io/hs/?d=" + exported.toString();
	window.prompt("Copy to clipboard: C+Ctrl, Enter", exported);
}

function importDeckByUrl () {
	if (window.location.search != "") {
		deck = new Array();
		var a = window.location.search.substring(3).split(",");
		$.each(a, function (i, v) {
			deck.push(getCardById(parseInt(v)));
		});
		console.log
		showDeck();
	}
}

// Event handler

$("#search").on("input", function () {
    options.search = $("#search").val().toLowerCase();
    options.page = 1;
    load();
});

$("#results").on("click", ".card", function () {
	$("#search").focus();
	if (deck.hasHowMuch($(this).data("id")) < 2 && deck.length < 30)
		deck.push(getCardById($(this).data("id")));
	deck = deck.sort(function(a,b) { return parseFloat(a.mana) - parseFloat(b.mana) } );
	showDeck();
});

$("#back").click(function () {
	if (options.page > 1)
		options.page--;
	display();
});

$("#next").click(function () {
	options.page++;
	display();
});

$("#clear").click(function () {
	clearDeck();
});

$("#export").click(function () {
	exportDeck();
});

$(".class-icon").click(function () {
	$(".class-icon[data-class=" + options.class + "]").removeClass("selected-icon");
	$(this).addClass("selected-icon");
	options.class = $(this).data("class");
	options.page = 1;
	$("#search").val("");
	options.search = "";
	$("#search").focus();
	load();
});

$("#deck").on("click", ".deck-entry", function() {
	var id = $(this).data("id");
	var place;
	$.each(deck, function (i, v){
		if (v.id == id) place = i;
	});
	deck.splice(place, 1);
	showDeck();
});

// Code to execute

$("#search").focus();