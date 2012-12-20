esprimaSyntaxTree = esprima.parse( data, {
                    comment: true,
                    range: true,
                    tokens: true
                });