#!/bin/sh

/run.sh &

wait_for_server()
{
	until curl -s http://localhost:3000 > /dev/null; do
		echo "Waiting for server to start..."
		sleep 2
	done
	echo "Server up"
}

add_service_account()
{
	curl -X POST http://localhost:3000/api/serviceaccounts \
    	-H "Accept: application/json" \
		-H "Content-Type: application/json" \
		-H "Authorization: Basic YWRtaW46YWRtaW4=" \
		-d '{
				"name": "grafana",
 				"role": "Admin",
  				"isDisabled": false}'
}

generate_token()
{
	response=$(curl -X POST http://localhost:3000/api/serviceaccounts/2/tokens \
    				-H "Accept: application/json" \
     				-H "Content-Type: application/json" \
    				-H "Authorization: Basic YWRtaW46YWRtaW4=" \
     				-d '{"name": "grafana"}')

	token=$(echo $response | jq -r '.key')
	export token
}

add_prometheus()
{
	curl -X POST http://localhost:3000/api/datasources \
		-H "Accept: application/json" \
  		-H "Content-Type: application/json" \
  		-H "Authorization: Bearer $token" \
		-d '{
				"name": "Prometheus",
				"type": "prometheus",
				"url": "http://prometheus:9090",
				"access": "proxy",
				"basicAuth": false
			}'
}

wait_for_server
add_service_account
generate_token
add_prometheus

wait
