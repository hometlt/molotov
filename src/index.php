<!-- исполользуется для генерации вьювера с PHP -->
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8"/>
    <?if(isset($_GET['images'])){?>
    <script src="http://ajax.googleapis.com/ajax/libs/jquery/1.10.2/jquery.min.js"></script>
    <script type="text/javascript" src="//molotov.hometlt.ru/sprite.js"></script>
    <link type="text/css" rel="stylesheet" media="all" href="//molotov.hometlt.ru/sprite.css"/>
    <style>.sprite{margin: 0} body{margin: 0}</style>
</head>
<body>
<div id="sprite"></div>
<script>
    $(function(){
        $("#sprite").sprite({
            images: "<?php echo $_GET['images'] ?>"
  <? if(isset($_GET['responsive'])){ ?>,responsive:  true <? }?>
  <? if(isset($_GET['width'])){ ?>,width:  <? echo  $_GET['width'] ?>  <? }?>
  <? if(isset($_GET['height'])){ ?>,height:  <? echo  $_GET['height'] ?>  <? }?>
        });
    })

</script>

<?} else {?>
    </head>
    <body>
    Не указаны изображения
<? } ?>
</body>
</html>

