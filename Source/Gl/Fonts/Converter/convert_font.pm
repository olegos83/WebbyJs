#!/usr/bin/perl
use strict;
binmode(STDOUT, ":utf8");

#Convert ttf font to js format for drawing text on canvas as vector.

#Usage: ./convert_font ttf_file [js_file]
#If js_file is ommited, js name is constructed automatically as family_weight_style.js.

#import font lib
use Font::TypefaceJS;

#test command line arguments
if (scalar @ARGV < 1) { die "Error: ttf file is not specified\n"; }

#init chartables and load font data
my @chartabs = ('Letterlike Symbols', 'Mathematical Operators', 'Currency Symbols', 'Cyrillic', 'Basic Latin', 'General Punctuation');
my $typeface = Font::TypefaceJS->new(input_filename => $ARGV[0], export_unicode_range_names => \@chartabs);

#go through char tables and print their chars
print "Scanning character tables\n\n";

foreach my $chtab (@chartabs) {
	print "$chtab\n";
	my $arr = $typeface->{unicode_ranges}{$chtab}{characters};
	if (length $arr) { print "@$arr\n\n"; } else { print "not found\n\n"; }
}

#set up JS filename
my $js_file_name = 'font_data.js';
if (scalar @ARGV > 1) { $js_file_name = $ARGV[1]; } else { $js_file_name = $typeface->{js_name}; }

#write JS font file
$typeface->write_file(output_filename => $js_file_name);
print "File $js_file_name successfuly written\n\n";
