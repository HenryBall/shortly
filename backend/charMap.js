var charCodes = {};
charCodes[1] = "a";
charCodes[2] = "b";
charCodes[3] = "c";
charCodes[4] = "d";
charCodes[5] = "e";
charCodes[6] = "f";
charCodes[7] = "g";
charCodes[8] = "h";
charCodes[9] = "i";
charCodes[10] = "j";
charCodes[11] = "k";
charCodes[12] = "l";
charCodes[13] = "m";
charCodes[14] = "n";
charCodes[15] = "o";
charCodes[16] = "p";
charCodes[17] = "q";
charCodes[18] = "r";
charCodes[19] = "s";
charCodes[20] = "t";
charCodes[21] = "u";
charCodes[22] = "v";
charCodes[23] = "w";
charCodes[24] = "x";
charCodes[25] = "y";
charCodes[26] = "z";
charCodes[27] = "A";
charCodes[28] = "B";
charCodes[29] = "C";
charCodes[30] = "D";
charCodes[31] = "E";
charCodes[32] = "F";
charCodes[33] = "G";
charCodes[34] = "H";
charCodes[35] = "I";
charCodes[36] = "J";
charCodes[37] = "K";
charCodes[38] = "L";
charCodes[39] = "M";
charCodes[40] = "N";
charCodes[41] = "O";
charCodes[42] = "P";
charCodes[43] = "Q";
charCodes[44] = "R";
charCodes[45] = "S";
charCodes[46] = "T";
charCodes[47] = "U";
charCodes[48] = "V";
charCodes[49] = "W";
charCodes[50] = "X";
charCodes[51] = "Y";
charCodes[52] = "Z";
charCodes[53] = "0";
charCodes[54] = "1";
charCodes[55] = "2";
charCodes[56] = "3";
charCodes[57] = "4";
charCodes[58] = "5";
charCodes[59] = "6";
charCodes[60] = "7";
charCodes[61] = "8";
charCodes[62] = "9";
charCodes[63] = "-";
charCodes[64] = "_";


module.exports = {

	getCodeForNum : function(num) {
		num = num + 1
		if (num > 0 && num < 65) {
			// return char code associated with the given num
			return charCodes[num];
		} else {
			// return a random value just in case we get an unexpected arg
			const rand = Math.random() * (63 - 0) + 0;
			return charCodes[rand];
		}
	}

};