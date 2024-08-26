import React, { useState } from 'react';
import axios from 'axios';
import { Box, Button, Center, Heading, Image, Text, VStack, useToast } from '@chakra-ui/react';

const AttendancePage = () => {
    const [message, setMessage] = useState('');
    const [studentData, setStudentData] = useState(null);
    const [pictureUrl, setPictureUrl] = useState(null);
    const toast = useToast();

    const takeAttendance = async () => {
        try {
            const response = await axios.post('http://localhost:5000/take_attendance');
            setMessage(response.data.message);
            setStudentData(response.data.data.student_data);
            setPictureUrl(response.data.data.profile_picture);
        } catch (error) {
            console.error('Error taking attendance:', error);
            setMessage('Error taking attendance');
            toast({
                title: 'Error',
                description: 'There was an error taking attendance.',
                status: 'error',
                duration: 5000,
                isClosable: true,
            });
        }
    };

    return (
        <Center h="100vh" bgGradient="linear(to-r, teal.300, blue.500)">
            <Box
                p={6}
                maxW="md"
                w="full"
                borderWidth={1}
                borderRadius="xl"
                boxShadow="lg"
                bg="white"
                textAlign="center"
                overflow="hidden"
                borderColor="gray.200"
            >
                {studentData ? (
                    <Box
                        p={5}
                        borderWidth={1}
                        borderRadius="lg"
                        boxShadow="md"
                        bg="gray.50"
                        textAlign="center"
                        borderColor="gray.200"
                        overflow="hidden"
                    >
                        <Image
                            src={`data:image/jpeg;base64,${pictureUrl}`}
                            alt="Student Profile"
                            boxSize="150px"
                            objectFit="cover"
                            borderRadius="full"
                            mb={4}
                            mx="auto"
                            borderWidth={2}
                            borderColor="teal.300"
                        />
                        <VStack spacing={3} align="center">
                            <Heading as="h3" size="md" mb={2} color="teal.600" textTransform="uppercase">
                                {studentData.name}
                            </Heading>
                            <Text fontSize="lg" color="gray.700" textTransform="uppercase">
                                Major: {studentData.major}
                            </Text>
                            <Text fontSize="lg" color="gray.700" textTransform="uppercase">
                                Starting Year: {studentData.starting_year}
                            </Text>
                            <Text fontSize="lg" color="gray.700" textTransform="uppercase">
                                Total Attendance: {studentData.total_attendance}
                            </Text>
                        </VStack>
                    </Box>
                ) : (
                    <>
                        <Button
                            colorScheme="teal"
                            onClick={takeAttendance}
                            mb={4}
                            size="lg"
                            textTransform="uppercase"
                        >
                            Mark Attendance
                        </Button>
                        {message && console.log(message)}
                    </>
                )}
            </Box>
        </Center>
    );
};

export default AttendancePage;
