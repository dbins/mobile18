		//http://www.javascriptlint.com/online_lint.php
		//Funcoes do aplicativo
		var codigo_entidade = 0;
		var arrayLista = [];
		var arrayAgenda = [];
		
		function confirmarClique() {
			if(confirm("Você deseja excluir este registro?")) {
				return true;
			} else {
				return false;
			}
		};
		
		function echeck(str) {

			var at="@";
			var dot=".";
			var lat=str.indexOf(at);
			var lstr=str.length;
			var ldot=str.indexOf(dot);
			if (str.indexOf(at)==-1){
			   //alert("Invalid E-mail ID");
			   return false;
			}

			if (str.indexOf(at)==-1 || str.indexOf(at)==0 || str.indexOf(at)==lstr){
			   //alert("Invalid E-mail ID");
			   return false;
			}

			if (str.indexOf(dot)==-1 || str.indexOf(dot)==0 || str.indexOf(dot)==lstr){
				//alert("Invalid E-mail ID");
				return false;
			}

			 if (str.indexOf(at,(lat+1))!=-1){
				//alert("Invalid E-mail ID");
				return false;
			 }

			 if (str.substring(lat-1,lat)==dot || str.substring(lat+1,lat+2)==dot){
				//alert("Invalid E-mail ID");
				return false;
			 }

			 if (str.indexOf(dot,(lat+2))==-1){
				//alert("Invalid E-mail ID");
				return false;
			 }
			
			 if (str.indexOf(" ")!=-1){
				//alert("Invalid E-mail ID")/
				return false;
			 }

			 return true;				
		}
		
		
		//Funcoes do Phonegap
		var isPhoneGapReady = false;
		var isConnected = false;
		var isHighSpeed = false;
		var tipo_conexao = "";
			
		var pictureSource;   // picture source
		var destinationType; // sets the format of returned value
		var email_aplicativo;
		var latitude = "";
		var longitude = "";
		
		
		//$(document).ready(function(){
		document.addEventListener("deviceready", onDeviceReady, false);
		//});
		 
		function onDeviceReady() {
			pictureSource = navigator.camera.PictureSourceType;
			destinationType = navigator.camera.DestinationType;
			isPhoneGapReady = true;
			// detect for network access
			networkDetection();
			// attach events for online and offline detection
			document.addEventListener("online", onOnline, false);
			document.addEventListener("offline", onOffline, false);
		}
		
		function networkDetection() {
			if (isPhoneGapReady) {
				
				
				var states = {};
				states[navigator.connection.UNKNOWN]  = 'Unknown connection';
				states[navigator.connection.ETHERNET] = 'Ethernet connection';
				states[navigator.connection.WIFI]     = 'WiFi connection';
				states[navigator.connection.CELL_2G]  = 'Cell 2G connection';
				states[navigator.connection.CELL_3G]  = 'Cell 3G connection';
				states[navigator.connection.CELL_4G]  = 'Cell 4G connection';
				states[navigator.connection.NONE]     = 'No network connection';
				var tipo_conexao = states[navigator.connection.type];
				
				if (tipo_conexao != 'No network connection') {
					isConnected = true;
				}
				
			}	
		}
		
		function onOnline() {
			isConnected = true;
		}
		function onOffline() {
			isConnected = false;
		}
		
	
		
		
		$(document).on('pageinit', '#faleconosco', function(){  
        $(document).on('click', '#enviar_contato', function() { // catch the form's submit event
		
			var field_tag_css = {
				"background-color": "#FFFF99"
			  };
			var continuar = true;
			var mensagem ="Ocorreram os seguintes erros:\n";
			
			if ($('#nome_contato').val() == "") {
				mensagem = mensagem + 'Prencha o seu nome\n';
				$('#nome_contato').css(field_tag_css);
				continuar = false;
			}

			if ($('#email_contato').val() == "") {
				mensagem = mensagem +  'Digite o endereco de e-mail\n';
				$('#email_contato').css(field_tag_css);
				continuar = false;
			} else {
				if (echeck($('#email_contato').val())==false){
				mensagem = mensagem + 'Preencha corretamente o endereco de e-mail\n';
				continuar = false;
				}
			}


			if ($('#mensagem_contato').val() == "") {
				mensagem = mensagem + 'Prencha a mensagem que deseja enviar\n';
				$('#mensagem_contato').css(field_tag_css);
				continuar = false;
			}
			
			if (isPhoneGapReady){
				if (isConnected) {
					//Continuar
				} else {
					continuar = false;
				}				
			} else {
				continuar = false;
			}
		
			
		
			if (continuar){
				// Send data to server through the ajax call
				// action is functionality we want to call and outputJSON is our data
				//formData : $('#check-contato').serialize()
					$.ajax({url: 'http://www.fisioagenda.hospedagemdesites.ws/xml/ajax_contato.php',
						data: {action : 'enviar', nome: $('#nome_contato').val(), email: $('#email_contato').val(), ddd_telefone: '00', numero_telefone: '00000000', mensagem: $('#mensagem_contato').val()},
						type: 'post',                   
						async: 'true',
                        dataType: 'text',
						beforeSend: function() {
							// This callback function will trigger before data is sent
							$.mobile.loading('show', {
								theme: "a",
								text: "Aguarde...",
								textonly: true,
								textVisible: true
							});
													},
						complete: function() {
							// This callback function will trigger on data sent/received complete
							$.mobile.loading('hide'); // This will hide ajax spinner
						},
						success: function (result) {
							
							if(result =="OK") {
								navigator.notification.alert('Obrigado por enviar sua mensagem!', alertDismissed, 'FisioAgenda', 'OK'); 
								$.mobile.changePage("#index");							
							} else {
							    navigator.notification.alert('Erro ao gravar suas informacoes!', alertDismissed, 'FisioAgenda', 'OK'); 
							}
						},
						error: function (request,error) {
							// This callback function will trigger on unsuccessful action                
							navigator.notification.alert('Houve um erro ao enviar suas informações!', alertDismissed, 'FisioAgenda', 'OK');
						}
					});                   
			} else {
				navigator.notification.alert(mensagem,alertDismissed, 'FisioAgenda', 'OK');
				//return false;
			}           
            return false; // cancel original event to prevent form submitting
        });    
		});
		
		$(document).on('pageshow', '#main', function(){
			//Listar dias para agendar
		});
		
		$(document).on('pageshow', '#listar', function(){
			//Listar agendamentos
		});
		
		$(document).on('pageinit', '#login', function(){  
        $(document).on('click', '#enviar_login', function() { // catch the form's submit event
		
			var field_tag_css = {
				"background-color": "#FFFF99"
			  };
			var continuar = true;
			var mensagem ="Ocorreram os seguintes erros:\n";
			
			if ($('#email_login').val() == "") {
				mensagem = mensagem +  'Digite o endereco de e-mail\n';
				$('#email_login').css(field_tag_css);
				continuar = false;
			} else {
				if (echeck($('#email_login').val())==false){
				mensagem = mensagem + 'Preencha corretamente o endereco de e-mail\n';
				continuar = false;
				}
			}

			if ($('#senha_login').val() == "") {
				mensagem = mensagem + 'Prencha a sua senha\n';
				$('#senha_login').css(field_tag_css);
				continuar = false;
			}
			
		
			if (continuar){
				email_aplicativo = $('#email_login').val();
				$.mobile.changePage("#main");                 
			} else {
				navigator.notification.alert(mensagem,alertDismissed, 'FisioAgenda', 'OK');
				//return false;
			}           
            return false; // cancel original event to prevent form submitting
        });    
		});
		
		$(document).on('pageshow', '#foto', function(){
			if (isPhoneGapReady){
				if (isConnected) {
					//obter posicao
					var options = {
					maximumAge: 3000,
					timeout: 5000,
					enableHighAccuracy: false
					};
					navigator.geolocation.getCurrentPosition(ObterCoordenadas, geoError, options);
					
					
					capturePhoto();
				} else {
					navigator.vibrate(2000);
					navigator.notification.alert('Não existe conexão com a Internet', alertDismissed, 'FisioAgenda', 'OK');
					$.mobile.changePage("#menu");
				}				
			} else {
				navigator.vibrate(2000);
				navigator.notification.alert('O aplicativo não está pronto!', alertDismissed, 'FisioAgenda', 'OK');
				$.mobile.changePage("#menu");
			}
		});
		
		//Comunicacao com o webservice
		function CancelarAgendamento(codigo_agenda) {
			$.ajax({url: 'http://www.fisioagenda.hospedagemdesites.ws/xml/ajax_cancelar_agenda.php',
			data: {action : 'enviar', codigo: codigo_agenda, entidade: codigo_entidade},
			type: 'post',                   
			async: 'true',
			dataType: 'text',
			beforeSend: function() {
				// This callback function will trigger before data is sent
				$.mobile.loading('show', {
					theme: "a",
					text: "Aguarde...",
					textonly: true,
					textVisible: true
				});
										},
			complete: function() {
				// This callback function will trigger on data sent/received complete
				$.mobile.loading('hide'); // This will hide ajax spinner
			},
			success: function (result) {
				
				if(result =="OK") {
					navigator.notification.alert('Cancelamento efetuado com sucesso!', alertDismissed, 'FisioAgenda', 'OK'); 
					$.mobile.changePage("#menu");							
				} else {
					navigator.notification.alert('Erro ao cancelar agendamento!', alertDismissed, 'FisioAgenda', 'OK'); 
					$.mobile.changePage("#menu");
				}
			},
			error: function (request,error) {
				// This callback function will trigger on unsuccessful action                
				navigator.notification.alert('Houve um erro ao enviar suas informações!', alertDismissed, 'FisioAgenda', 'OK');
				$.mobile.changePage("#menu");
			}
			});  
		}
		
		function ConfirmarAgendamento(codigo_agenda) {
			$.ajax({url: 'http://www.fisioagenda.hospedagemdesites.ws/xml/ajax_adicionar_agenda.php',
			data: {action : 'enviar', codigo: codigo_agenda, entidade: codigo_entidade},
			type: 'post',                   
			async: 'true',
			dataType: 'text',
			beforeSend: function() {
				// This callback function will trigger before data is sent
				$.mobile.loading('show', {
					theme: "a",
					text: "Aguarde...",
					textonly: true,
					textVisible: true
				});
										},
			complete: function() {
				// This callback function will trigger on data sent/received complete
				$.mobile.loading('hide'); // This will hide ajax spinner
			},
			success: function (result) {
				
				if(result =="OK") {
					navigator.notification.alert('Cancelamento efetuado com sucesso!', alertDismissed, 'FisioAgenda', 'OK'); 
					$.mobile.changePage("#menu");							
				} else {
					navigator.notification.alert('Erro ao cancelar agendamento!', alertDismissed, 'FisioAgenda', 'OK'); 
					$.mobile.changePage("#menu");
				}
			},
			error: function (request,error) {
				// This callback function will trigger on unsuccessful action                
				navigator.notification.alert('Houve um erro ao enviar suas informações!', alertDismissed, 'FisioAgenda', 'OK');
				$.mobile.changePage("#menu");
			}
			});  
		}
		
		function AgendamentosMarcados() {
			$.ajax({
				type: "GET",
				url: 'http://www.fisioagenda.hospedagemdesites.ws/xml/xml_lista.php',
				data: {action : 'enviar', codigo: codigo_entidade},
				dataType: "xml",
				success: function(data) {
					$(data).find('agenda').each(function(){
						var codigo = $(this).find("codigo").text();
						var data = $(this).find("data").text();
						var horario_inicio = $(this).find("horario_inicio").text();
						var horario_final = $(this).find("horario_final").text();
						var status = $(this).find("status").text();
						var dados_temporarios = [codigo, data, horario_inicio, horario_final, status];
						arrayLista.push(dados_temporarios);
					});
				},
				error: function (request,error) {
					navigator.notification.alert('Houve um erro ao recuperar suas informações!', alertDismissed, 'FisioAgenda', 'OK');
					$.mobile.changePage("#menu");
				}
			});
		}
		
		function ListarAgenda() {
			$.ajax({
				type: "GET",
				url: 'http://www.fisioagenda.hospedagemdesites.ws/xml/xml_agenda.php',
				data: {action : 'enviar', codigo: codigo_entidade},
				dataType: "xml",
				success: function(data) {
					$(data).find('agenda').each(function(){
						var data = $(this).find("data").text();
						var horarios = [];
						$(this).find('horarios').each(function(){
							$(this).find('horario').each(function(){
								var codigo = $(this).find("horario_final").text();
								var horario_inicial = $(this).find("horario_final").text();
								var horario_final = $(this).find("horario_final").text();
								var status = $(this).find("horario_final").text();
								var dados_temporarios2 = [codigo, horario_inicial, horario_final, status];
								horarios.push(dados_temporarios2);
							});
						});
						
						var dados_temporarios = [data, horarios];
						arrayAgenda.push(dados_temporarios);
					});
				},
				error: function (request,error) {
					navigator.notification.alert('Houve um erro ao recuperar suas informações!', alertDismissed, 'FisioAgenda', 'OK');
					$.mobile.changePage("#menu");
				}
			});
		}
		
		function ValidarLogin(login_informado, senha_informada) {
			$.ajax({url: 'http://www.fisioagenda.hospedagemdesites.ws/xml/ajax_login.php',
			data: {acao : 'entrar', login: login_informado, senha: senha_informada},
			type: 'post',                   
			async: 'true',
			dataType: 'text',
			beforeSend: function() {
				// This callback function will trigger before data is sent
				$.mobile.loading('show', {
					theme: "a",
					text: "Aguarde...",
					textonly: true,
					textVisible: true
				});
										},
			complete: function() {
				// This callback function will trigger on data sent/received complete
				$.mobile.loading('hide'); // This will hide ajax spinner
			},
			success: function (result) {
				
				if(result =="0") {
					navigator.notification.alert('O login ou a senha informada não foram localizados!', alertDismissed, 'FisioAgenda', 'OK'); 
				} else {
					if (result =="ERRO") {
						navigator.notification.alert('Houve um erro ao consultar nosso sistema!', alertDismissed, 'FisioAgenda', 'OK'); 
					} else {
						codigo_entidade = result;
						$.mobile.changePage("#menu");
					}
				}
			},
			error: function (request,error) {
				// This callback function will trigger on unsuccessful action                
				navigator.notification.alert('Houve um erro ao enviar suas informações!', alertDismissed, 'FisioAgenda', 'OK');
			}
			});  
		}
		
		//Funcoes para tirar foto
		
		// alert dialog dismissed
		function alertDismissed() {
			// do something
		}

		function AlertConfirmed(buttonIndex) {
			if (buttonIndex ==1){ //OK
				$('#content_news').text('Aguarde o seu dispositivo abrir a câmera para tirar a foto.');	
				if (isPhoneGapReady){
					if (isConnected) {
						capturePhoto();
					} else {
						navigator.vibrate(2000);
						navigator.notification.alert('Não existe conexão com a Internet', alertDismissed, 'FisioAgenda', 'OK');
						$.mobile.changePage("#menu");
					}				
				} else {
					navigator.vibrate(2000);
					navigator.notification.alert('O aplicativo não está pronto!', alertDismissed, 'FisioAgenda', 'OK');
					$.mobile.changePage("#menu");
				}
			}
			if (buttonIndex ==2){ //Cancelar
				$.mobile.changePage("#menu");
			}
		}

		function clearCache() {
				navigator.camera.cleanup();
		}
			 
		var retries = 0;
		function onCapturePhoto(fileURI) {
			var win = function (r) {
				clearCache();
				retries = 0;
				//navigator.notification.alert('Concluido! A foto foi enviada para nosso servidor!', alertDismissed, 'Enviar Foto', 'OK');
				navigator.vibrate(2000);
				navigator.notification.confirm( 'Concluido! A foto foi enviada para nosso servidor! Deseja enviar outra foto?', AlertConfirmed, 'FisioAgenda', ['OK', 'SAIR']);
				//$.mobile.changePage("#main");
			}
		 
			var fail = function (error) {
				if (retries == 0) {
					retries ++
					setTimeout(function() {
						onCapturePhoto(fileURI)
					}, 1000)
				} else {
					retries = 0;
					clearCache();
					navigator.notification.alert('Ocorreu um problema!', alertDismissed, 'FisioAgenda', 'OK');
					$.mobile.changePage("#menu");
				}
			}
			
			
			$('#content_news').text('Aguarde, a foto está sendo enviada para o nosso servidor!');
		 
			var options = new FileUploadOptions();
			options.fileKey = "recFile";
			options.fileName = fileURI.substr(fileURI.lastIndexOf('/') + 1);
			options.mimeType = "image/jpeg";
			
			var params = new Object();
			params.email = email_aplicativo;
			params.latitude = latitude;
			params.longitude = longitude;
			 
			//options.params = {}; // if we need to send parameters to the server request
			options.params = params;
			
			var ft = new FileTransfer();
			ft.upload(fileURI, encodeURI("http://www.fisioagenda.hospedagemdesites.ws/xml/upload_foto.php"), win, fail, options);
		}
		 
		function capturePhoto() {
			navigator.camera.getPicture(onCapturePhoto, onFail, {
				quality: 100,
				destinationType: destinationType.FILE_URI
			});
		}
		 
		function onFail(message) {
			navigator.vibrate(2000);
			navigator.notification.alert('Ocorreu o seguinte erro: ' + message, alertDismissed, 'FisioAgenda', 'OK');
		}
			
		//Retornar coordenadas
		function ObterCoordenadas(position) {
			latitude = position.coords.latitude;
			longitude = position.coords.longitude;
		}
			
		function geoError(error) {
			//Nao fazer nada, as coordenadas sao opcionais
			//alert('codigo: ' + error.code + '\n' + 'mensagem: ' + error.message + '\n');
		}

		
