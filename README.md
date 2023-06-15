# cd poc directory where Dockerfile and main.py exists
# run following command to create docker image but dont forget to login dockerhub first

# If you're already in linux/amd64 machine you can run like following as well
# docker build . --tag dockerhub-id/image-name
# docker push dockerhub-id/image-name
docker buildx build --platform linux/amd64 --push -t hackaccounts/test-bacalhau-script2 .

# Now you can go test directory. You can run as follow
sh test.sh

#You need to give your image name and wanted url. 