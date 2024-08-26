import React, { useRef, useState } from 'react';
import { Box, Button, Center, FormControl, FormLabel, Heading, Input, VStack, Image, useToast, HStack } from '@chakra-ui/react';
import axios from 'axios';

const RegisterPage = () => {
  const [name, setName] = useState('');
  const [major, setMajor] = useState('');
  const [startingYear, setStartingYear] = useState('');
  const [image, setImage] = useState(null);
  const [isCapturing, setIsCapturing] = useState(false); // State to toggle between video and image
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const toast = useToast();
  const [stream, setStream] = useState(null); // State to manage video stream

  // Set up video stream
  const startVideo = () => {
    setIsCapturing(true);
    navigator.mediaDevices.getUserMedia({ video: true })
      .then(newStream => {
        if (stream) {
          // Stop previous stream
          stream.getTracks().forEach(track => track.stop());
        }
        setStream(newStream);
        videoRef.current.srcObject = newStream;
        videoRef.current.play();
      })
      .catch(err => {
        console.error('Error accessing webcam:', err);
        toast({
          title: 'Error',
          description: 'Could not access the webcam.',
          status: 'error',
          duration: 5000,
          isClosable: true,
        });
      });
  };

  // Capture image from video stream
  const capture = () => {
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');
    canvas.width = videoRef.current.videoWidth;
    canvas.height = videoRef.current.videoHeight;
    context.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
    const imageSrc = canvas.toDataURL('image/jpeg');
    setImage(imageSrc);
    setIsCapturing(false); // Show captured image

    // Stop the video stream after capturing
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null); // Clear the stream state
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!image) {
      toast({
        title: 'Error',
        description: 'Please capture an image first.',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
      return;
    }

    const formData = new FormData();
    formData.append('profilePicture', dataURItoBlob(image));
    formData.append('name', name);
    formData.append('major', major);
    formData.append('startingYear', startingYear);

    try {
      const response = await axios.post('http://localhost:5000/register', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      toast({
        title: 'Success',
        description: response.data.message,
        status: 'success',
        duration: 5000,
        isClosable: true,
      });
    } catch (error) {
      console.error('Error registering student:', error);
      toast({
        title: 'Error',
        description: 'There was an error registering the student.',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    }
  };

  const dataURItoBlob = (dataURI) => {
    const byteString = atob(dataURI.split(',')[1]);
    const mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0];
    const arrayBuffer = new ArrayBuffer(byteString.length);
    const uintArray = new Uint8Array(arrayBuffer);

    for (let i = 0; i < byteString.length; i++) {
      uintArray[i] = byteString.charCodeAt(i);
    }

    return new Blob([arrayBuffer], { type: mimeString });
  };

  return (
    <Center h="150vh" bgGradient="linear(to-r, teal.300, blue.500)">
      <Box
        p={6} // Increased padding
        maxW="lg"
        w="full"
        borderWidth={1}
        borderRadius="lg"
        boxShadow="lg"
        bg="white"
        overflowY="auto"
      >
        <Heading as="h1" size="xl" textAlign="center" mb={6}> {/* Increased margin-bottom */}
          Register as Student
        </Heading>
        <form onSubmit={handleSubmit}>
          <VStack spacing={6}> {/* Increased spacing */}
            <FormControl isRequired>
              <FormLabel>Name</FormLabel>
              <Input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter your name"
              />
            </FormControl>
            <FormControl isRequired>
              <FormLabel>Major</FormLabel>
              <Input
                type="text"
                value={major}
                onChange={(e) => setMajor(e.target.value)}
                placeholder="Enter your major"
              />
            </FormControl>
            <FormControl isRequired>
              <FormLabel>Starting Year</FormLabel>
              <Input
                type="number"
                value={startingYear}
                onChange={(e) => setStartingYear(e.target.value)}
                placeholder="Enter your starting year"
              />
            </FormControl>
            <FormControl>
              <FormLabel>Photo</FormLabel>
              {(image || isCapturing) &&
                <Box borderWidth={1} borderRadius="lg" overflow="hidden" mb={6} position="relative" width="100%" height="300px">
                  {isCapturing ? (
                    <video
                      ref={videoRef}
                      width="100%"
                      height="100%"
                      style={{ borderRadius: '8px' }}
                    />
                  ) : (
                    <Image
                      src={image}
                      boxSize="100%"
                      objectFit="cover"
                      borderRadius="lg"
                    />
                  )}
                  <canvas
                    ref={canvasRef}
                    style={{ display: 'none' }}
                  />
                </Box>
              }
              <HStack spacing={4} mb={6}>
                {isCapturing ? (
                  <Button colorScheme="teal" onClick={capture} flex="1">
                    Capture
                  </Button>
                ) : (
                  <Button colorScheme="teal" onClick={startVideo} flex="1">
                    Start Video
                  </Button>
                )}
              </HStack>
            </FormControl>
            <Button type="submit" colorScheme="blue" w="full" mt={4}>
              Register
            </Button>
          </VStack>
        </form>
      </Box>
    </Center>
  );
};

export default RegisterPage;
