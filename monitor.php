<?php
    $oldtime = filemtime("chat.txt");
    ob_start();
    header("Content-Type: text/event-stream");
    while(true)
    {
        clearstatcache();
        $newtime = filemtime("chat.txt");
        if($newtime != $oldtime)
        {
            $data = file_get_contents("chat.txt");
            echo "event:chatmsg\n";
            echo "retry:100\n";
            echo "data:$data\n\n";
            ob_flush();
            flush();
            $oldtime = $newtime;
        }
        sleep(1);
    }
?>