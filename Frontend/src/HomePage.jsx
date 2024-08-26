import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Button, Center, Heading, HStack } from '@chakra-ui/react';

const HomePage = () => {
    const navigate = useNavigate();

    const handleRegisterClick = () => {
        navigate('/register');
    };

    const handleAttendanceClick = () => {
        navigate('/attendance');
    };

    return (
        <Box
            h="100vh"
            bgImage="url('/images/background.jpg')"
            bgSize="cover"
            bgPosition="right center"  // Move background to the right
            bgRepeat="no-repeat"
            backgroundAttachment="fixed"  // Ensure the background image doesn't scroll with the content
        >
            <Box
                textAlign="center"
                p={8}
                borderRadius="md"
                width="lg"  // Adjust the width here
                position="absolute"  // Position box absolutely
                top="20%"  // Adjust top position to control vertical alignment
                left="10%"  // Adjust left position to control horizontal alignment
            >
                <Heading
                    as="h1"
                    size="2xl"
                    color="white"
                    mb={8}
                >
                    Welcome to Attendance System
                </Heading>
                <HStack spacing={6} justify="center">
                    <Button
                        colorScheme="teal"
                        size="lg"
                        onClick={handleRegisterClick}
                    >
                        Register as Student
                    </Button>
                    <Button
                        colorScheme="teal"
                        size="lg"
                        onClick={handleAttendanceClick}
                    >
                        Take Attendance
                    </Button>
                </HStack>
            </Box>
        </Box>
    );
};

export default HomePage;
