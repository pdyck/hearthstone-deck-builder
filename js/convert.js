var cards = [];

function Dummy () {
	return {
		id: 0,
		name: "",
		mana: 0,
		attack: 0,
		health: 0,
		effect: "",
		type: "",
		subtype: "",
		rarity: "",
		class: "",
		artist: "",
		flavor: ""
	};
}

function format (input) {
	for (i in input) {
		var o = Dummy();
		o.id = input[i]["cardCode"];
		o.name = input[i]["cardName"];
		o.mana = input[i]["마나비용"];
		o.attack = input[i]["공격력"];
		o.health = input[i]["생명력"];
		o.effect = input[i]["효과"];
		if (input[i]["종류"] == "하수인")
			o.type = "minion";
		if (input[i]["종류"] == "주문")
			o.type = "spell";
		if (input[i]["종류"] == "무기")
			o.type = "weapon";
		o.subtype = input[i]["종족"];
		o.rarity = input[i]["등급"];
		o.class = input[i]["직업제한"];
		o.artist = input[i]["일러스트"];
		o.flavor = input[i]["comment"];

		if (o.class == "공통")
			o.class = "";
		if (o.class == "도적")
			o.class = "rogue";
		if (o.class == "주술사")
			o.class = "shaman";
		if (o.class == "전사")
			o.class = "warrior";
		if (o.class == "사냥꾼")
			o.class = "hunter";
		if (o.class == "마법사")
			o.class = "mage";
		if (o.class == "성기사")
			o.class == "paladin";
		if (o.class == "흑마법사")
			o.class = "warlock";
		if (o.class == "사제")
			o.class = "priest";
		if (o.class == "드루이드")
			o.class = "druid";

		if (o.rarity == "무료")
			o.rarity = "free";
		if (o.rarity == "일반")
			o.rarity = "common";
		if (o.rarity == "희귀")
			o.rarity = "rare";
		if (o.rarity == "영웅")
			o.rarity = "epic";
		if (o.rarity == "전설")
			o.rarity = "legendary";



		cards.push(o);
	}
}

function write () {
	for (i in cards) {
		document.write("{\n");
		document.write("\t\"id\": \"" + cards[i]["id"] + "\",\n");
		document.write("\t\"name\": \"" + cards[i]["name"] + "\",\n");
		document.write("\t\"mana\": \"" + cards[i]["mana"] + "\",\n");
		document.write("\t\"attack\": \"" + cards[i]["attack"] + "\",\n");
		document.write("\t\"health\": \"" + cards[i]["health"] + "\",\n");
		document.write("\t\"effect\": \"" + cards[i]["effect"] + "\",\n");
		document.write("\t\"type\": \"" + cards[i]["type"] + "\",\n");
		document.write("\t\"subtype\": \"" + cards[i]["subtype"] + "\",\n");
		document.write("\t\"rarity\": \"" + cards[i]["rarity"] + "\",\n");
		document.write("\t\"class\": \"" + cards[i]["class"] + "\",\n");
		document.write("\t\"artist\": \"" + cards[i]["artist"] + "\",\n");
		document.write("\t\"flavor\": \"" + cards[i]["flavor"] + "\"\n");
		document.write("},\n");
	}
}