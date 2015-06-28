#!/usr/bin/perl
#Author Evan Salazar
#from http://www.ohmpie.com/imageencode/
#--------------------------------------------
#
#Generate a .wav file for 16 bit mono PCM
#
#-------------------------------------------
use strict;
package SimpleWave;

sub genWave {

#Get the reference to the data array

my ($audioData) = @_;

#This is the default sample rate
my $samplerate = 44100;
my $bits = 16;
my $samples = $#{$audioData} + 1;
my $channels = 1;


#Do Calculations for data wave headers
my $byterate = $samplerate * $channels * $bits / 8;
my $blockalign = $channels * $bits / 8;
my $filesize = $samples * ($bits/8) * $channels + 36;

#RIFF Chunk;
my $riff = pack('a4Va4','RIFF',$filesize,'WAVE');

#Format Chunk
my $format = pack('a4VvvVVvv',
	    	'fmt ',
		16,1,
		$channels,
		$samplerate,
		$byterate,
		$blockalign,
		$bits);

#Data Chunk
my $dataChunk = pack('a4V','data',$blockalign * $samples);

#Read audoData array
my $data;
for(my $i=0;$i<$samples;$i++) {
    
    $data .= pack('v',$audioData->[$i]);
}

#Return a byte string of the wave
return $riff . $format . $dataChunk. $data;
}
1;
