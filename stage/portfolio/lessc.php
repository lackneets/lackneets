<?php 

ini_set('display_errors', true);

$filename = preg_replace('/\.less(\.css)*$/i', '.less', __DIR__ . $_SERVER['REQUEST_URI']);

if($filename == __FILE__){
  header("HTTP/1.0 404 Not Found");
  echo "Not Found";
}else if(file_exists($filename)){
	header("Content-Type: text/css");
	//echo shell_exec('/usr/local/bin/lessc "'.$filename.'"');
  echo shell_exec('/usr/bin/lessc "'.$filename.'"');
}else{
	header("HTTP/1.0 404 Not Found");
	echo "Not Found";
}

?>