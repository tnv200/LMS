package com.torryharris.BackEndSample.Repository;

//import org.springframework.data.repository.CrudRepository;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.torryharris.BackEndSample.Entity.Tag;


@Repository
public interface TagRepository extends JpaRepository<Tag, Integer> {

}
