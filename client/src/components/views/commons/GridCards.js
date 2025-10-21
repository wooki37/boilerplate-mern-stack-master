import React from 'react'
import { Col } from 'antd';
import { Link } from 'react-router-dom';

function GridCards({ image = '', movieId, movieName }) {
    const to = `/movie/${movieId}`;

    return (
        <Col lg={6} md={8} xs={24}>
            <div style={{ position: 'relative' }}>
                <Link to={to}>
                    {image ? (
                        <img
                            src={image}
                            alt={movieName || 'poster'}
                            style={{ width: '100%', display: 'block' }}
                            loading='lazy'
                        />
                    ) : (
                        <div style={{
                            width: '100%',
                            paddingTop: '150%',
                            background: '#333',
                            color: '#fff',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: 12,
                        }}
                        >                No Image
                        </div>
                    )}
                </Link>
            </div>
        </Col>
    );
}

export default GridCards